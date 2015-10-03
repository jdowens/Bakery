var AnimationLayer = cc.Layer.extend({
    spriteSheet:null,
    runningAction:null,
    sprite:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.runner_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.runner_png);
        this.addChild(this.spriteSheet);

        var animFrames = [];
        for (var i = 0; i < 8; i++)
        {
            var str = "runner" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.05);

        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#runner0.png");
        this.sprite.attr({x:80,y:85});
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);
    }
});