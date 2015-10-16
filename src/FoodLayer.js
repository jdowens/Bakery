// Creator is responsible for initializing spriteFrameCache with required frames

var FoodLayer = cc.Layer.extend({
    spriteSheet:null,
    foodSprite:null,
    foodValue:0,
    patternQueue:null,
    foodQueue:null,
    currentPattern:null,

    ctor:function(foodGraphic) {
        this._super();
        this.init(foodGraphic);
    },

    init:function(foodGraphic) {
        this.scheduleUpdate();
        this.setupGraphics(foodGraphic);
        this.setupQueues();
    },

    setupGraphics:function(foodGraphic) {
        this.spriteSheet = new cc.SpriteBatchNode(foodGraphic);
        this.addChild(this.spriteSheet);
        this.foodSprite = new cc.Sprite();
        this.spriteSheet.addChild(this.foodSprite);
    },

    setupQueues:function() {
        this.patternQueue = [];
        this.foodQueue = [];
    },

    addPatternToQueue:function(pattern) {
        this.patternQueue.push(pattern);
    },

    addFoodToQueue:function(frame) {
        this.foodQueue.push(frame);
    },

    nextPattern:function() {
        this.currentPattern = this.patternQueue.shift();
        this.addChild(this.currentPattern);
        this.currentPattern.onStart(this);
    },

    advanceFood:function() {
        if (this.foodQueue.length > 0) {
            this.foodSprite.setSpriteFrame(this.foodQueue.shift());
        }
    },

    onStart:function() {
        this.foodSprite.setFrame(this.foodQueue.shift());
        this.foodSprite.setPosition(cc.p(100, cc.director.getWinSize().y / 2));
        this.nextPattern();
    },

    update:function(dt) {
        if (this.currentPattern != null && this.currentPattern.isFinsihed()) {
            if (this.currentPattern.advancesFood) {
                this.advanceFood();
            }
            this.currentPattern.onFinish();
            this.removeChild(this.currentPattern);
            delete this.currentPattern();
            this.nextPattern();
        }
    }
});