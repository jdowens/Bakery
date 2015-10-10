var TestCakeCombinedLayer = cc.Layer.extend({
    foodSprite:null,
    ovenSprite:null,
    remainingTime:0,
    money:0,
    curCakeValue:0,
    currentPattern:null,
    patternQueue:[],
    statusLayer:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        this.scheduleUpdate();
        this.setupGraphics();
        this.setupTestQueue();
        this.nextPattern();
    },

    setupTestQueue:function() {
        this.patternQueue.push(new MultiClickPatternLayer(false, false, res.testcakepattern1_png, 1, cc.p(0,0)));
        this.patternQueue.push(new MultiClickPatternLayer(false, false, res.testcakepattern1_png, 3, cc.p(10,10)));
    },

    nextPattern:function() {
        if (this.patternQueue.length > 0) {
            this.currentPattern = this.patternQueue.shift();
            this.addChild(this.currentPattern);
            this.currentPattern.onStart(this);
        }
    },

    setupGraphics:function() {
        // setup graphics
        this.ovenSprite = new cc.Sprite(res.oven_png);
        this.addChild(this.ovenSprite);
        this.ovenSprite.attr({x:cc.director.getWinSize().width - this.ovenSprite.getTextureRect().width / 2,
            y: cc.director.getWinSize().height / 2});

        cc.spriteFrameCache.addSpriteFrames(res.testcake_plist);
        this.spriteBatch = new cc.SpriteBatchNode(res.testcake_png);
        this.addChild(this.spriteBatch);

        this.foodSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcake1.png"));
        this.foodSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.foodSprite);
    },

    update:function(dt) {
        if (this.currentPattern != null && this.currentPattern.isFinished()) {
            this.currentPattern.onFinish();
            cc.log(this.curCakeValue);
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
    }
});

/*var Pattern = cc.Class.extend({
    ctor:function() {
        this._super();
    }
});

// pattern is inheritable
Pattern.extend = cc.Class.extend;*/

var MultiClickPatternLayer = cc.Layer.extend({
    MAX_CLICKS:5,
    clickCountRandom:false,
    patternPositionRandom:false,
    patternSprite:null,
    actionLayer:null,
    requiredClicks:0,
    remainingClicks:0,
    missClicks:0,
    offsetFromFood:null,            // defaults to center of food
    finished:false,
    clickAndDragSelected:false,
    listener:null,

    ctor:function(clickCountRandom, patternPositionRandom, patternSpriteResource, requiredClicks, offsetFromFood) {
        this._super();
        this.clickCountRandom = clickCountRandom;
        this.patternPositionRandom = patternPositionRandom;
        this.requiredClicks = requiredClicks;
        this.remainingClicks = requiredClicks;
        this.offsetFromFood = offsetFromFood;
        this.setupClickCount();
        this.setupPatternSprite(patternSpriteResource);
    },

    setupClickCount:function() {
        if (this.clickCountRandom) {
            this.requiredClicks = Math.floor((Math.random()*this.MAX_CLICKS)+1);
            this.remainingClicks = this.requiredClicks;
        }
    },

    setupPatternSprite:function(resource) {
        this.patternSprite = new cc.Sprite(resource);
        this.addChild(this.patternSprite);
    },

    setupPatternSpritePosition:function() {
        if (!this.patternPositionRandom) {
            var foodPos = this.actionLayer.foodSprite.getPosition();
            var x = foodPos.x + this.offsetFromFood.x;
            var y = foodPos.y + this.offsetFromFood.y;
            this.patternSprite.setPosition(cc.p(x,y));
        }
        else {
            var foodSprite = this.actionLayer.foodSprite;
            this.patternSprite.attr({x:foodSprite.getPosition().x + ((Math.random() - 0.5)*(foodSprite.getTextureRect().width - this.patternSprite.getTextureRect().width)),
                y:foodSprite.getPosition().y + ((Math.random() - 0.5)*(foodSprite.getTextureRect().height - this.patternSprite.getTextureRect().height))});
        }
    },

    onStart:function(layer) {
        this.actionLayer = layer;
        this.setupPatternSpritePosition();
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    onFinish:function() {
        cc.eventManager.removeListener(this.listener);
        this.actionLayer.curCakeValue += this.requiredClicks*10 + this.missClicks*-10;
    },

    setupMouseCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.onMultiClickEnd(event.getLocation());
            }
        });
        cc.eventManager.addListener(this.listener, this);
    },

    setupTouchCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch, event) {
                return true;
            },
            onTouchEnded:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onMultiClickEnd(touch.getLocation());
            }
        });
        cc.eventManager.addListener(this.listener, this);
    },

    onMultiClickEnd:function(point) {
        var rect = this.patternSprite.getBoundingBoxToWorld();
        if (cc.rectContainsPoint(rect, point)) {
            this.remainingClicks--;
            if (this.remainingClicks == 0) {
                this.finished = true;
            }
            var sfx_index = Math.floor(Math.random()*3);
            if (sfx_index == 0)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
            else if (sfx_index == 1)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot6.wav", false);
            else if (sfx_index == 2)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot9.wav", false);
        }
        else {
            cc.audioEngine.playEffect("res/SFX/Randomize10.wav", false);
            this.missClicks++;
            this.actionLayer.addToTimer(-1.0);
        }
    },

    isFinished:function() {
        return this.finished;
    }
});

var ClickAndHoldPatternLayer = cc.Layer.extend({

});