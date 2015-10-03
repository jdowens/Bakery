var TestCakeLayer = cc.Layer.extend({
    statusLayer:null,
    spriteBatch:null,
    cakeSprite:null,
    patternSprite:null,
    ovenSprite:null,
    currentPattern:1,
    requiredClicks:0,
    remainingClicks:0,
    money:0,
    curCakeValue:0,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        this.setupGraphics();
        this.initializeClicks();
        this.setupCallbacks();
        this.setupOpacities();
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

        this.cakeSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcake1.png"));
        this.cakeSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.cakeSprite);

        this.patternSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcakepattern1.png"));
        this.patternSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.patternSprite);
    },

    initializeClicks:function() {
        // setup click count for current region
        this.requiredClicks = Math.floor((Math.random()*4)+1);
        this.remainingClicks = this.requiredClicks;
    },

    setupOpacities:function() {
        this.patternSprite.setOpacity((this.remainingClicks / this.requiredClicks) * 223 + 32);
    },

    setupCallbacks:function() {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                if (target.currentPattern <= 2) {
                    var rect = new cc.Rect(target.patternSprite.getPosition().x - target.patternSprite.getTextureRect().width / 2,
                        target.patternSprite.getPosition().y - target.patternSprite.getTextureRect().height / 2,
                        target.patternSprite.getTextureRect().width,
                        target.patternSprite.getTextureRect().height);
                    var point = event.getLocation();
                    cc.log(rect.x, rect.y, rect.width, rect.height);
                    cc.log(point.x, point.y);
                    if (cc.rectContainsPoint(rect, point)) {
                        target.remainingClicks--;
                        target.setupOpacities();
                        cc.log("Remaining clicks: " + target.remainingClicks);
                        target.curCakeValue += 10;
                        var sfx_index = Math.floor(Math.random()*3);
                        if (sfx_index == 0)
                            cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
                        else if (sfx_index == 1)
                            cc.audioEngine.playEffect("res/SFX/Laser_Shoot6.wav", false);
                        else if (sfx_index == 2)
                            cc.audioEngine.playEffect("res/SFX/Laser_Shoot9.wav", false);

                        // clicks exhausted for current pattern
                        if (target.remainingClicks <= 0) {
                            target.remainingClicks = 0;

                            target.currentPattern++;
                            if (target.currentPattern == 2) {
                                target.initializeClicks();
                                target.setupOpacities();
                                target.patternSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcakepattern2.png"));
                                target.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake2.png"));
                            }
                            else if (target.currentPattern == 3) {
                                target.spriteBatch.removeChild(target.patternSprite);
                                delete target.patternSprite;
                                target.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake3.png"));
                                target.setupDragCallback();
                                target.currentPattern++;
                            }
                        }
                    }
                }
            }
        }, this);
    },

    setupDragCallback:function() {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            selected:false,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                var rect = new cc.Rect(target.cakeSprite.getPosition().x - target.cakeSprite.getTextureRect().width / 2,
                    target.cakeSprite.getPosition().y - target.cakeSprite.getTextureRect().height / 2,
                    target.cakeSprite.getTextureRect().width,
                    target.cakeSprite.getTextureRect().height);
                var point = event.getLocation();
                if (cc.rectContainsPoint(rect, point)) {
                    cc.log("Clicked inside cake sprite!");
                    this.selected = true;
                }
            },
            onMouseMove:function(event) {
                var target = event.getCurrentTarget();
                if (this.selected) {
                    target.cakeSprite.x = event.getLocation().x;
                    target.cakeSprite.y = event.getLocation().y;
                }
            },
            onMouseUp:function(event) {
                this.selected = false;
                var target = event.getCurrentTarget();
                var rect = new cc.Rect(target.ovenSprite.getPosition().x - target.ovenSprite.getTextureRect().width / 2,
                    target.ovenSprite.getPosition().y - target.ovenSprite.getTextureRect().height / 2,
                    target.ovenSprite.getTextureRect().width,
                    target.ovenSprite.getTextureRect().height);
                var point = event.getLocation();
                if (cc.rectContainsPoint(rect, point)) {
                    cc.log("Cake baked!");
                    cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
                    target.updateMoney();
                    target.statusLayer.spawnEarnedText(target.curCakeValue, point);
                    target.resetCake();
                    cc.eventManager.removeListener(this);
                }
            }
        }, this);
    },

    resetCake:function() {
        this.cakeSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake1.png"));

        this.patternSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcakepattern1.png"));
        this.patternSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.patternSprite);

        this.currentPattern = 1;

        this.initializeClicks();
        this.setupOpacities();

        this.curCakeValue = 0;
    },

    updateMoney:function() {
        this.money += this.curCakeValue;
    },

    setStatusLayer:function(layer) {
        this.statusLayer = layer;
    }

});