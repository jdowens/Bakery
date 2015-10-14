
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
            this.actionLayer.spriteBatch.runAction(new SpriteShake(0.2, 3, 3));
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