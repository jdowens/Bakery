// Creator is responsible for initializing spriteFrameCache with required frames

var FoodLayer = cc.Layer.extend({
    spriteSheet:null,
    foodSprite:null,
    foodValue:0,
    patternQueue:null,
    foodQueue:null,
    currentPattern:null,
    finished:false,

    ctor:function(foodGraphic) {
        this._super();
        this.init(foodGraphic);
    },

    init:function(foodGraphic) {
        this.setupGraphics(foodGraphic);
        this.setupQueues();
    },

    setupGraphics:function(foodGraphic) {
        this.spriteSheet = new cc.SpriteBatchNode(foodGraphic);
        this.addChild(this.spriteSheet);
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
        if (this.patternQueue.length > 0) {
            this.currentPattern = this.patternQueue.shift();
            this.addChild(this.currentPattern);
            this.currentPattern.onStart(this);
        }
        else {
            this.finished = true;
        }
    },

    advanceFood:function() {
        if (this.foodQueue.length > 0) {
            this.foodSprite.setSpriteFrame(this.foodQueue.shift());
        }
    },

    onStart:function() {
        this.scheduleUpdate();
        this.foodSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(this.foodQueue.shift()));
        //this.foodSprite.attr({x:100, y:cc.director.getWinSize().height / 2});
        this.spriteSheet.addChild(this.foodSprite);
        this.spriteSheet.attr({x:100, y:cc.director.getWinSize().height / 2});
        this.nextPattern();
    },

    update:function(dt) {
        if (this.currentPattern != null && this.currentPattern.isFinished()) {
            if (this.currentPattern.advancesFood) {
                this.advanceFood();
            }
            this.currentPattern.onFinish();
            this.removeChild(this.currentPattern);
            delete this.currentPattern;
            this.nextPattern();
        }
    },

    onFinish:function() {
        cc.log("Food completed");
    },

    isFinished:function() {
        return this.finished;
    }
});