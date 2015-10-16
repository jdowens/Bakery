var BreadLayer = cc.Layer.extend({
    foodSprite:null,
    ovenSprite:null,
    remainingTime:0,
    money:0,
    curCakeValue:0,
    currentPattern:null,
    patternQueue:[],
    statusLayer:null,
    foodQueue:[],
    gameOver:false,
    ovenCakeValue:0,
    spriteBatch:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        this.scheduleUpdate();
        this.setupMouseCallbacks();
        this.setupTestQueue();
        this.setupGraphics();
        this.nextPattern();
    },

    setupMouseCallbacks:function() {
        var listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onOvenRequest(event.getLocation());
            }
        });
        cc.eventManager.addListener(listener, this);
    },

    onOvenRequest:function(position) {
        var rect = this.ovenSprite.getBoundingBoxToWorld();
        if (!this.ovenSprite.available && cc.rectContainsPoint(rect, position)) {
            var status = this.ovenSprite.removeFood();
            if (status != Oven.FoodStatus.COOKED)
                this.ovenCakeValue = 0;
            this.onFinish();
        }
    },

    setupTestQueue:function() {
        var testPattern = new MultiClickPatternLayer(true, res.testcakepattern3_png, 1, cc.p(30, 0));
        testPattern.addOnProgressAction(this, function() {this.spriteBatch.runAction(new SpriteShake(0.2, 3, 3));});
        testPattern.addOnProgressAction(this, function() {
            var sfx_index = Math.floor(Math.random()*3);
            if (sfx_index == 0)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
            else if (sfx_index == 1)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot6.wav", false);
            else if (sfx_index == 2)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot9.wav", false);
        });
        this.patternQueue.push(testPattern);
        var anotherTestPattern = new MultiClickPatternLayer(true, res.testcakepattern3_png, 1, cc.p(-30, 0));
        anotherTestPattern.addOnProgressAction(this, function() {this.spriteBatch.runAction(new SpriteShake(1.0, 10, 10));});
        this.patternQueue.push(anotherTestPattern);
        this.patternQueue.push(new MultiClickPatternLayer(true, res.testcakepattern3_png, 1, cc.p(0, 0)));

        this.patternQueue.push(new ClickAndHoldPatternLayer(true, 200, res.testcakepattern3_png, res.testcakepattern4_png, 0.5, cc.p(0, 0)));
        for (var i = 0; i < 3; i++) {
            var dlp = new DrawLinesPatternLayer(1, 10, res.testcakepattern3_png, true, cc.p(-50 + i*50, 0));
            dlp.addOnCompletionAction(this, function() {
                this.spriteBatch.runAction(new SpriteFunctionPath(0.3, new Function("return 0"),
                    new Function("t", "return 10*Math.sin(4*t*Math.PI + Math.PI)"), true));
            })
            this.patternQueue.push(dlp);
        }

        for (var i = 1; i <= 8; i++)
        {
            this.foodQueue.push("bread" + i + ".png");
        }
    },

    nextPattern:function() {
        if (this.patternQueue.length > 0) {
            this.currentPattern = this.patternQueue.shift();
            this.addChild(this.currentPattern);
            this.currentPattern.onStart(this.foodSprite.getPosition());
        }
        else {
            this.onPlaceInOven();
        }
    },

    setupGraphics:function() {
        // setup graphics
        this.ovenSprite = new Oven(res.oven_png);
        this.addChild(this.ovenSprite);
        //this.ovenSprite.attr({x:cc.director.getWinSize().width - this.ovenSprite.getTextureRect().width / 2,
        //    y: cc.director.getWinSize().height / 2});
        this.ovenSprite.attr({x:cc.director.getWinSize().width - this.ovenSprite.statusBar.getSprite().getBoundingBoxToWorld().width,
            y: cc.director.getWinSize().height / 2});

        cc.spriteFrameCache.addSpriteFrames(res.bread_plist);
        this.spriteBatch = new cc.SpriteBatchNode(res.bread_png);
        this.addChild(this.spriteBatch);

        this.foodSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(this.foodQueue.shift()));
        //this.foodSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.foodSprite.attr({x:this.ovenSprite.statusBar.getSprite().getBoundingBoxToWorld().width,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.foodSprite);
    },

    update:function(dt) {
        //this.addToTimer(-dt);
        //if(this.remainingTime < 0)
        //    this.onTimeUp();
        if (this.currentPattern != null && this.currentPattern.isFinished()) {
            if (this.currentPattern.advancesFood)
                this.advanceFood();
            this.currentPattern.onFinish();
            this.ovenCakeValue += this.currentPattern.value;
            cc.log(this.ovenCakeValue);
            this.removeChild(this.currentPattern);
            delete this.currentPattern;
            this.nextPattern();
        }
    },

    addToTimer:function(time) {
        this.remainingTime += time;
    },

    setStatusLayer:function(layer) {
        this.statusLayer = layer;
    },

    advanceFood:function() {
        if (this.foodQueue.length > 1) {
            var frame = this.foodQueue.shift();
            this.foodSprite.setSpriteFrame(frame);
        }
        else if (this.foodQueue.length == 1){
            var frame = this.foodQueue.shift();
            this.foodSprite.setSpriteFrame(frame);
            this.patternQueue.push(new DragAndDropPatternLayer(this.foodSprite, this.ovenSprite));
        }
    },

    resetGraphics:function() {
        this.foodSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.foodQueue.shift()));
    },

    onPlaceInOven:function() {
        //this.ovenCakeValue = this.curCakeValue;
        //this.curCakeValue = 0;
        this.foodSprite.attr({x:this.ovenSprite.statusBar.getSprite().getBoundingBoxToWorld().width,y:cc.director.getWinSize().height/2});
        this.setupTestQueue();
        this.resetGraphics();
        this.nextPattern();
    },

    onFinish:function() {
        cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
        this.statusLayer.spawnEarnedText(this.ovenCakeValue, this.ovenSprite.getPosition());
        this.addToTimer(this.ovenCakeValue/100);
        this.money += this.ovenCakeValue;
        this.ovenCakeValue = 0;
    },

    onTimeUp:function() {
        while (this.patternQueue.length > 0) {
            var cur = this.patternQueue.shift();
            delete cur;
        }
        while (this.foodQueue.length > 0) {
            var cur = this.foodQueue.shift();
            delete cur;
        }
        this.gameOver = true;
    }
});