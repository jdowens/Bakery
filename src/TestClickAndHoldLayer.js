/**
 * Created by james on 10/9/2015.
 */
var TestClickAndHoldLayer = cc.Layer.extend({
    MAX_HOLD_DURATION:0.5,
    MIN_HOLD_DURATION:0.25,
    DELTA_TIME_PER_GOLD:0.001,
    MAXIMUM_GOLD:100,
    statusLayer:null,
    spriteBatch:null,
    cakeSprite:null,
    patternSprite:null,
    patternOutlineSprite:null,
    ovenSprite:null,
    currentPattern:1,
    requiredHoldTime:0,
    remainingHoldTime:0,
    money:0,
    curCakeValue:0,
    remainingTime:0,
    selected:false,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        this.scheduleUpdate();
        this.setupGraphics();
        this.initializeHoldTime();
        if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
        else if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        this.setupPatternSize();
        this.addToTimer(10.0);
    },

    update:function(dt) {
        if (this.selected) {
            this.remainingHoldTime -= dt;
            this.setupPatternSize();
        }
        else if (this.remainingHoldTime < this.requiredHoldTime && this.currentPattern <= 2) {
            if (!this.selected) {
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
                this.curCakeValue += this.MAXIMUM_GOLD -
                    Math.floor(Math.abs(this.remainingHoldTime) / this.DELTA_TIME_PER_GOLD);
                this.remainingHoldTime = 0;
                this.selected = false;
                this.currentPattern++;
                if (this.currentPattern == 2) {
                    this.initializeHoldTime();
                    this.randomizePatternLocation();
                    this.setupPatternSize();
                    this.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake2.png"));
                }
                else if (this.currentPattern == 3) {
                    this.patternSprite.setOpacity(0);
                    this.patternOutlineSprite.setOpacity(0);
                    this.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake3.png"));
                    if ('touches' in cc.sys.capabilities) {
                        this.setupTouchDragCallback();
                    }
                    else if ('mouse' in cc.sys.capabilities) {
                        this.setupMouseDragCallback();
                    }
                    this.currentPattern++;
                }
            }
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

        this.cakeSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcake1.png"));
        this.cakeSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.cakeSprite);

        this.patternSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("testcakepattern3.png"));
        //this.patternSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.spriteBatch.addChild(this.patternSprite);

        this.patternOutlineSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("testcakepattern4.png"));
        this.spriteBatch.addChild(this.patternOutlineSprite);

        this.randomizePatternLocation();
    },

    initializeHoldTime:function() {
        // setup click count for current region
        this.requiredHoldTime = Math.random()*(this.MAX_HOLD_DURATION-this.MIN_HOLD_DURATION) + this.MIN_HOLD_DURATION;
        this.remainingHoldTime = this.requiredHoldTime;
        cc.log("Req: " + this.requiredHoldTime + "Rem: " + this.remainingHoldTime);
    },

    setupPatternSize:function() {
        var percent = (this.requiredHoldTime - this.remainingHoldTime) / this.MAX_HOLD_DURATION;
        this.patternSprite.setScale(percent, percent);
        percent = (this.requiredHoldTime / this.MAX_HOLD_DURATION);
        this.patternOutlineSprite.setScale(percent, percent);
    },

    addToTimer:function(float) {
        this.remainingTime += float;
    },

    randomizePatternLocation:function() {
        var x = this.cakeSprite.getPosition().x + ((Math.random() - 0.5)*(this.cakeSprite.getTextureRect().width - this.patternSprite.getTextureRect().width));
        var y = this.cakeSprite.getPosition().y + ((Math.random() - 0.5)*(this.cakeSprite.getTextureRect().height - this.patternSprite.getTextureRect().height));
        this.patternSprite.attr({x:x,y:y});
        this.patternOutlineSprite.attr({x:x,y:y});
    },

    setupMouseCallbacks:function() {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                if (target.currentPattern <= 2) {
                    var rect = new cc.Rect(target.patternSprite.getPosition().x - target.patternSprite.getTextureRect().width / 2,
                        target.patternSprite.getPosition().y - target.patternSprite.getTextureRect().height / 2,
                        target.patternSprite.getTextureRect().width,
                        target.patternSprite.getTextureRect().height);
                    var point = event.getLocation();

                    // clicked on pattern
                    if (cc.rectContainsPoint(rect, point)) {
                        target.selected = true;
                    }
                    // missed the pattern
                    else {
                        cc.audioEngine.playEffect("res/SFX/Randomize10.wav", false);
                        target.selected = false;
                        target.addToTimer(-1.0);
                    }
                }
            },
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.selected = false;
            }
        }, this);
    },

    setupMouseDragCallback:function() {
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

                var target = event.getCurrentTarget();
                var rect = new cc.Rect(target.ovenSprite.getPosition().x - target.ovenSprite.getTextureRect().width / 2,
                    target.ovenSprite.getPosition().y - target.ovenSprite.getTextureRect().height / 2,
                    target.ovenSprite.getTextureRect().width,
                    target.ovenSprite.getTextureRect().height);
                var point = event.getLocation();
                if (cc.rectContainsPoint(rect, point) && this.selected) {
                    cc.log("Cake baked!");
                    cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
                    target.updateMoney();
                    target.addToTimer(target.curCakeValue / 50);
                    target.statusLayer.spawnEarnedText(target.curCakeValue, point);
                    target.resetCake();
                    cc.eventManager.removeListener(this);
                }
                this.selected = false;
            }
        }, this);
    },

    setupTouchCallbacks:function() {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                if (target.currentPattern <= 2) {
                    var rect = new cc.Rect(target.patternSprite.getPosition().x - target.patternSprite.getTextureRect().width / 2,
                        target.patternSprite.getPosition().y - target.patternSprite.getTextureRect().height / 2,
                        target.patternSprite.getTextureRect().width,
                        target.patternSprite.getTextureRect().height);
                    var point = touch.getLocation();
                    // clicked on pattern
                    if (cc.rectContainsPoint(rect, point)) {
                        target.selected = true;
                    }
                    // missed the pattern
                    else {
                        cc.audioEngine.playEffect("res/SFX/Randomize10.wav", false);
                        target.selected = false;
                        target.addToTimer(-1.0);
                    }
                }
                return true;
            },

            onTouchEnded:function(touch, event) {
                var target = event.getCurrentTarget();
                target.selected = false;
            }
        }, this);
    },

    setupTouchDragCallback:function() {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            selected:false,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                var rect = new cc.Rect(target.cakeSprite.getPosition().x - target.cakeSprite.getTextureRect().width / 2,
                    target.cakeSprite.getPosition().y - target.cakeSprite.getTextureRect().height / 2,
                    target.cakeSprite.getTextureRect().width,
                    target.cakeSprite.getTextureRect().height);
                var point = touch.getLocation();
                if (cc.rectContainsPoint(rect, point)) {
                    cc.log("Clicked inside cake sprite!");
                    this.selected = true;
                }
                return true;
            },
            onTouchMoved:function(touch, event) {
                var target = event.getCurrentTarget();
                if (this.selected) {
                    target.cakeSprite.x = touch.getLocation().x;
                    target.cakeSprite.y = touch.getLocation().y;
                }
            },
            onTouchEnded:function(touch, event) {

                var target = event.getCurrentTarget();
                var rect = new cc.Rect(target.ovenSprite.getPosition().x - target.ovenSprite.getTextureRect().width / 2,
                    target.ovenSprite.getPosition().y - target.ovenSprite.getTextureRect().height / 2,
                    target.ovenSprite.getTextureRect().width,
                    target.ovenSprite.getTextureRect().height);
                var point = touch.getLocation();
                if (cc.rectContainsPoint(rect, point) && this.selected) {
                    cc.log("Cake baked!");
                    cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
                    target.updateMoney();
                    target.addToTimer(target.curCakeValue / 50);
                    target.statusLayer.spawnEarnedText(target.curCakeValue, point);
                    target.resetCake();
                    cc.eventManager.removeListener(this);
                }
                this.selected = false;
            }
        }, this);
    },

    resetCake:function() {
        this.cakeSprite.attr({x:cc.director.getWinSize().width/2,y:cc.director.getWinSize().height/2});
        this.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake1.png"));

        this.randomizePatternLocation();
        this.patternSprite.setOpacity(255);
        this.patternOutlineSprite.setOpacity(255);

        this.currentPattern = 1;

        this.initializeHoldTime();
        this.setupPatternSize();

        this.selected = false;

        this.curCakeValue = 0;
    },

    updateMoney:function() {
        this.money += this.curCakeValue;
    },

    setStatusLayer:function(layer) {
        this.statusLayer = layer;
    }

});