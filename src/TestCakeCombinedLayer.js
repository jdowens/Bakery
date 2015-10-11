var TestCakeCombinedLayer = cc.Layer.extend({
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
            var perror = this.ovenSprite.removeFood();
            this.ovenCakeValue = Math.floor((1-perror)*this.ovenCakeValue);
            if (this.ovenCakeValue < 0)
                this.ovenCakeValue = 0;
            this.onFinish();
        }
    },

    setupTestQueue:function() {
        for (var i = 0; i < 4; i++) {
            this.patternQueue.push(new MultiClickPatternLayer(true, true, false, res.testcakepattern3_png, 0, cc.p(0, 0)));
        }
        this.patternQueue.push(new MultiClickPatternLayer(true, true, true, res.testcakepattern3_png, 0, cc.p(0, 0)));
        this.patternQueue.push(new ClickAndHoldPatternLayer(false, false, true, 200, res.testcakepattern3_png, res.testcakepattern4_png, 0.5, cc.p(0, 0)));
        this.foodQueue.push("testcake1.png");
        this.foodQueue.push("testcake2.png");
        this.foodQueue.push("testcake3.png");
    },

    nextPattern:function() {
        if (this.patternQueue.length > 0) {
            this.currentPattern = this.patternQueue.shift();
            this.addChild(this.currentPattern);
            this.currentPattern.onStart(this);
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

        cc.spriteFrameCache.addSpriteFrames(res.testcake_plist);
        this.spriteBatch = new cc.SpriteBatchNode(res.testcake_png);
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
        this.ovenCakeValue = this.curCakeValue;
        this.curCakeValue = 0;
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

var Pattern = cc.Layer.extend({
    finished:false,
    listener:null,
    actionLayer:null,

    ctor:function() {
        this._super();
    },

    onStart:function(layer) {
        this.actionLayer = layer;
    },

    onFinish:function() {
        if (this.listener !== null)
            cc.eventManager.removeListener(this.listener);
    },

    isFinished:function() {
        return this.finished;
    }
});

// pattern is inheritable
Pattern.extend = cc.Class.extend;

var MultiClickPatternLayer = Pattern.extend({
    MAX_CLICKS:2,
    clickCountRandom:false,
    patternPositionRandom:false,
    patternSprite:null,
    requiredClicks:0,
    remainingClicks:0,
    missClicks:0,
    offsetFromFood:null,            // defaults to center of food
    clickAndDragSelected:false,
    advancesFood:false,

    ctor:function(clickCountRandom, patternPositionRandom, advancesFood, patternSpriteResource, requiredClicks, offsetFromFood) {
        this._super();
        this.clickCountRandom = clickCountRandom;
        this.patternPositionRandom = patternPositionRandom;
        this.advancesFood = advancesFood;
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

    setupPatternSpriteOpacities:function() {
        this.patternSprite.setOpacity((this.remainingClicks / this.MAX_CLICKS) * 223 + 32);
    },

    onStart:function(layer) {
        this._super(layer);
        this.setupPatternSpritePosition();
        this.setupPatternSpriteOpacities();
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    onFinish:function() {
        this._super();
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
            this.setupPatternSpriteOpacities();
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
            //cc.audioEngine.playEffect("res/SFX/Randomize10.wav", false);
            //this.missClicks++;
            //this.actionLayer.addToTimer(-1.0);
        }
    },

    isFinished:function() {
        return this.finished;
    }
});

var ClickAndHoldPatternLayer = Pattern.extend({
    MAX_HOLD_DURATION:0.125,
    MIN_HOLD_DURATION:0.0625,
    SECONDS_PER_GOLD:0.001,
    max_gold:0,
    patternSprite:null,
    patternOutlineSprite:null,
    requiredHoldTime:0,
    remainingHoldTime:0,
    selected:false,
    holdTimeRandom:false,
    positionRandom:false,
    offsetFromFood:null,
    actionLayer:null,
    advancesFood:false,

    ctor:function(holdTimeRandom, positionRandom, advancesFood, max_gold, patternSpriteResource,
    patternOutlineSpriteResource, requiredHoldTime, offsetFromFood) {
        this._super();
        this.holdTimeRandom = holdTimeRandom;
        this.patternPositionRandom = positionRandom;
        this.advancesFood = advancesFood;
        this.max_gold = max_gold;
        this.requiredHoldTime = requiredHoldTime;
        this.remainingHoldTime = requiredHoldTime;
        this.offsetFromFood = offsetFromFood;
        this.setupHoldTime();
        this.setupPatternSprite(patternSpriteResource, patternOutlineSpriteResource);
    },

    setupHoldTime:function() {
        if (this.holdTimeRandom) {
            this.requiredHoldTime = Math.random()*(this.MAX_HOLD_DURATION-this.MIN_HOLD_DURATION) + this.MIN_HOLD_DURATION;
            this.remainingHoldTime = this.requiredHoldTime;
        }
    },

    setupPatternSprite:function(psResource, psoResource) {
        this.patternSprite = new cc.Sprite(psResource);
        this.patternOutlineSprite = new cc.Sprite(psoResource);
        this.addChild(this.patternSprite);
        this.addChild(this.patternOutlineSprite);
    },

    setupPatternSpritePosition:function() {
        if (!this.patternPositionRandom) {
            var foodPos = this.actionLayer.foodSprite.getPosition();
            var x = foodPos.x + this.offsetFromFood.x;
            var y = foodPos.y + this.offsetFromFood.y;
            this.patternSprite.setPosition(cc.p(x,y));
            this.patternOutlineSprite.setPosition(cc.p(x,y));
        }
        else {
            var foodSprite = this.actionLayer.foodSprite;
            var x = foodSprite.getPosition().x + ((Math.random() - 0.5)*(foodSprite.getTextureRect().width - this.patternSprite.getTextureRect().width));
            var y = foodSprite.getPosition().y + ((Math.random() - 0.5)*(foodSprite.getTextureRect().height - this.patternSprite.getTextureRect().height));
            this.patternSprite.attr({x:x,y:y});
            this.patternOutlineSprite.attr({x:x,y:y});
        }
    },

    setupPatternSize:function() {
        var percent = (this.requiredHoldTime - this.remainingHoldTime) / this.MAX_HOLD_DURATION;
        this.patternSprite.setScale(percent, percent);
        percent = (this.requiredHoldTime / this.MAX_HOLD_DURATION);
        this.patternOutlineSprite.setScale(percent, percent);
    },

    onStart:function(layer) {
        this._super(layer);
        this.scheduleUpdate();
        this.setupPatternSize();
        this.setupPatternSpritePosition();
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    update:function(dt) {
        if (this.selected) {
            this.remainingHoldTime -= dt;
            this.setupPatternSize();
        }
        else if (this.remainingHoldTime < this.requiredHoldTime) {
            if (!this.selected) {
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
                this.curCakeValue += this.MAXIMUM_GOLD -
                    Math.floor(Math.abs(this.remainingHoldTime) / this.DELTA_TIME_PER_GOLD);
                this.finished = true;
            }
        }
    },

    setupMouseCallbacks:function() {
        this.listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onClickAndHoldBegin(event.getLocation());
            },
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.onClickAndHoldEnd(event.getLocation());
            }
        });
        cc.eventManager.addListener(this.listener, this);
    },

    setupTouchCallbacks:function() {
        this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onClickAndHoldBegin(touch.getLocation());
                return true;
            },
            onTouchEnded:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onClickAndHoldEnd(touch.getLocation());
            }
        });
    },

    onClickAndHoldBegin:function(position) {
        var rect = this.patternOutlineSprite.getBoundingBoxToWorld();
        if (cc.rectContainsPoint(rect, position)) {
            this.selected = true;
        }
        else {
            //cc.audioEngine.playEffect("res/SFX/Randomize10.wav", false);
            //this.selected = false;
            //this.actionLayer.addToTimer(-1.0);
        }
    },

    onClickAndHoldEnd:function(position) {
        this.selected = false;
    },

    onFinish:function() {
        this._super();
        var value = this.max_gold -
            Math.floor(Math.abs(this.remainingHoldTime) / this.SECONDS_PER_GOLD);
        if (value < 0)
            value = 0;
        this.actionLayer.curCakeValue += value;
    }
});

var DragAndDropPatternLayer = Pattern.extend({
    spriteTarget:null,
    spriteDestination:null,
    actionLayer:null,
    selected:false,
    drugFrom:null,

    ctor:function(spriteTarget, spriteDestination) {
        this._super();
        this.spriteTarget = spriteTarget;
        this.spriteDestination = spriteDestination;
    },

    onStart:function(layer) {
        this._super(layer);
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    setupMouseCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onDragBegin(event.getLocation());
            },
            onMouseMove:function(event) {
                var target = event.getCurrentTarget();
                target.onDrag(event.getLocation());
            },
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.onDragEnd(event.getLocation());
            }
        });

        cc.eventManager.addListener(this.listener, this);
    },

    setupTouchCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onDragBegin(touch.getLocation());
                return true;
            },
            onTouchMoved:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onDrag(touch.getLocation());
            },
            onTouchEnded:function(tourch, event) {
                var target = event.getCurrentTarget();
                target.onDragEnd(touch.getLocation());
            }
        });
    },

    onDragBegin:function(pos) {
        var rect = this.spriteTarget.getBoundingBoxToWorld();
        if (cc.rectContainsPoint(rect, pos)) {
            this.selected = true;
            this.drugFrom = new cc.p(pos.x, pos.y);
        }
    },

    onDrag:function(pos) {
        if (this.selected) {
            this.spriteTarget.x = pos.x;
            this.spriteTarget.y = pos.y;
        }
    },

    onDragEnd:function(pos) {
        var rect = this.spriteDestination.getBoundingBoxToWorld();
        if (this.selected && cc.rectContainsPoint(rect, pos)) {
            if (this.spriteDestination.available) {
                cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
                this.finished = true;
            }
            else {
                this.spriteTarget.setPosition(this.drugFrom);
            }
        }
        this.selected = false;
    },

    onFinish:function() {
        this._super();
        this.spriteDestination.startBaking(Math.random() + 2.0);
    },

    isFinished:function() {
        return this.finished;
    }

});