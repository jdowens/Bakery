
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
        cc.eventManager.addListener(this.listener);
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