var DrawLinesPatternLayer = Pattern.extend({
    patternSprite:null,
    requiredLines:0,
    requiredLineLength:0,
    remainingLines:0,
    lineStart:null,
    lineEnd:null,
    offsetFromFood:null,
    advancesFood:false,
    validLineStarted:false,

    ctor:function(requiredLines, requiredLineLength, patternSpriteResource, advancesFood, offsetFromFood) {
        this._super();
        this.lineStart = new cc.p(0,0);
        this.lineEnd = new cc.p(0,0);
        this.requiredLines = requiredLines;
        this.remainingLines = requiredLines;
        this.requiredLineLength = requiredLineLength;
        this.patternSprite = new cc.Sprite(patternSpriteResource);
        this.addChild(this.patternSprite);
        this.offsetFromFood = new cc.p(offsetFromFood.x, offsetFromFood.y);
        this.advancesFood = advancesFood;
    },

    onStart:function(layer) {
        this._super(layer);
        this.setupPatternSpritePosition();
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    setupPatternSpritePosition:function() {
        var foodSprite = this.actionLayer.foodSprite;
        var foodPos = foodSprite.getPosition();
        var x = foodPos.x + this.offsetFromFood.x;
        var y = foodPos.y + this.offsetFromFood.y;
        this.patternSprite.attr({x:x,y:y});
    },

    setupMouseCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onLineStart(event.getLocation());
            },
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.onLineEnd(event.getLocation());
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
                target.onLineStart(touch.getLocation());
                return true;
            },
            onTouchEnded:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onLineEnd(touch.getLocation());
            }
        });
        cc.eventManager.addListener(this.listener);
    },

    onLineStart:function(pos) {
        var rect = this.patternSprite.getBoundingBoxToWorld();
        this.lineStart.x = pos.x;
        this.lineStart.y = pos.y;
        if (cc.rectContainsPoint(rect, pos)) {
            this.validLineStarted = true;
        }
    },

    onLineEnd:function(pos) {
        //var rect = this.patternSprite.getBoundingBoxToWorld();
        if (this.validLineStarted) {
            this.validLineStarted = false;
            this.lineEnd.x = pos.x;
            this.lineEnd.y = pos.y;
            //cc.log(cc.pDistance(this.lineStart, this.lineEnd));
            if (cc.pDistance(this.lineStart, this.lineEnd) > this.requiredLineLength) {
                this.remainingLines--;
                this.onProgress();
                //this.actionLayer.spriteBatch.runAction(new SpriteFunctionPath(0.3, new Function("return 0"),
                //    new Function("t", "return 10*Math.sin(4*t*Math.PI + Math.PI)"), true));
                if (this.remainingLines == 0) {
                    this.finished = true;
                }
            }
        }
    },

    onFinish:function() {
        this._super();
        delete this.lineStart;
        delete this.lineEnd;
        this.actionLayer.curCakeValue += this.requiredLines*10;
    }
});