var AnimationLayer = cc.Layer.extend({
    spriteSheet:null,
    cakeFrames:null,
    cakeSprite:null,
    patternSprite:null,
    currentRegion:1,
    pattern:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        this.scheduleUpdate();
        cc.spriteFrameCache.addSpriteFrames(res.testcake_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.testcake_png);
        this.addChild(this.spriteSheet);
        //this.cakeSprite = new cc.Sprite("#testcake1.png");            // another way to create sprite

        var spriteFrame = cc.spriteFrameCache.getSpriteFrame("testcake1.png");
        this.cakeSprite = cc.Sprite.create(spriteFrame);
        this.cakeSprite.attr({x:cc.director.getWinSize().width / 2,y:cc.director.getWinSize().height / 2});
        this.spriteSheet.addChild(this.cakeSprite);

        spriteFrame = cc.spriteFrameCache.getSpriteFrame("testcakepattern1.png");
        this.patternSprite = cc.Sprite.create(spriteFrame);
        this.patternSprite.attr({x:this.cakeSprite.getPosition().x,
                                 y:this.cakeSprite.getPosition().y});
        this.spriteSheet.addChild(this.patternSprite);


        // enable inputs
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();
            },
            onMouseUp: function(event){
                var str = "Mouse Up detected, Key: " + event.getButton();
                var target = event.getCurrentTarget();

                /*var rect = new cc.Rect(target.cakeSprite.getOffsetPosition().x, target.cakeSprite.getOffsetPosition().y, target.cakeSprite.getTextureRect().width, target.cakeSprite.getTextureRect().height);
                var pos = target.cakeSprite.convertToWorldSpace(target.cakeSprite.getOffsetPosition());
                var point = target.cakeSprite.convertToNodeSpace(event.getLocation());
                cc.log(point.x, point.y);
                cc.log(pos.x, pos.y);
                cc.log(rect.x, rect.y, rect.width, rect.height);*/

                var pos = event.getLocation();

                target.pattern.checkPosition(pos);
            },
            onMouseDown: function(event){
                var str = "Mouse Down detected, Key: " + event.getButton();
            },
            onMouseScroll: function(event){
                var str = "Mouse Scroll detected, X: " + event.getLocationX() + "  Y:" + event.getLocationY();
            }
        },this);

        // setup patterns
        this.pattern = new MultiClickPattern(4, new cc.Rect(this.patternSprite.convertToWorldSpace(this.patternSprite.getOffsetPosition()).x,
                                                            this.patternSprite.convertToWorldSpace(this.patternSprite.getOffsetPosition()).y,
                                                            this.patternSprite.getTextureRect().width,
                                                            this.patternSprite.getTextureRect().height), this);
        this.pattern.setAlive(true);
    },

    update:function(dt) {
        if (!this.pattern.getAlive())
        {
            delete this.pattern;
            this.currentRegion++;
            this.patternSprite.attr({x:this.cakeSprite.getPosition().x - this.patternSprite.getTextureRect().width / 2,
                y:this.cakeSprite.getPosition().y - this.patternSprite.getTextureRect().height / 2});
            this.cakeSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("testcake2.png"));
            this.spriteSheet.addChild(this.patternSprite);
            this.pattern = new MultiClickPattern(4, new cc.Rect(this.patternSprite.convertToWorldSpace(this.patternSprite.getOffsetPosition()).x,
                this.patternSprite.convertToWorldSpace(this.patternSprite.getOffsetPosition()).y,
                this.patternSprite.getTextureRect().width,
                this.patternSprite.getTextureRect().height), this);
            this.pattern.setAlive(true);
        }
    }

});