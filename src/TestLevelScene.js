var TestLevelScene = cc.Layer.extend({
    foodLayer:null,
    oven:null,
    oven2:null,

    onEnter:function() {
        this._super();
        this.init();
    },

    init:function() {
        this.oven = new Oven(res.oven_png, this, this.ovenDone);
        this.oven.attr({x:cc.director.getWinSize().width - this.oven.statusBar.getSprite().getBoundingBoxToWorld().width,
            y: cc.director.getWinSize().height / 2});
        this.addChild(this.oven);

        this.oven2 = new Oven(res.oven_png, this, this.ovenDone);
        this.oven2.attr({x:cc.director.getWinSize().width / 2,
            y: 100});
        this.addChild(this.oven2);

        this.foodLayer = new FoodLayer(res.bread_png);
        this.addChild(this.foodLayer);

        var testPattern = new MultiClickPatternLayer(true, res.testcakepattern3_png, 2, cc.p(0,0));
        testPattern.addOnProgressAction(this.foodLayer, function() {
            this.spriteSheet.runAction(new SpriteShake(0.2, 3, 3));
        });
        testPattern.addOnCompletionAction(this.foodLayer, function() {
            var sfx_index = Math.floor(Math.random()*3);
            if (sfx_index == 0)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
            else if (sfx_index == 1)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot6.wav", false);
            else if (sfx_index == 2)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot9.wav", false);
        });

        var testPatternTwo = new DrawLinesPatternLayer(3, 20, res.testcakepattern3_png, true, cc.p(100,0));
        testPatternTwo.addOnProgressAction(this.foodLayer, function() {
            this.spriteSheet.runAction(new SpriteShake(0.2, 50, 50));
        });
        testPatternTwo.addOnCompletionAction(this.foodLayer, function() {
            var sfx_index = Math.floor(Math.random()*3);
            if (sfx_index == 0)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
            else if (sfx_index == 1)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot6.wav", false);
            else if (sfx_index == 2)
                cc.audioEngine.playEffect("res/SFX/Laser_Shoot9.wav", false);
        });

        var testPatternThree = new DragAndDropPatternLayer(this.foodLayer.spriteSheet, this.oven2);

        cc.spriteFrameCache.addSpriteFrames(res.bread_plist);
        this.foodLayer.addPatternToQueue(testPattern);
        this.foodLayer.addPatternToQueue(testPatternTwo);
        this.foodLayer.addPatternToQueue(testPatternThree);
        this.foodLayer.addFoodToQueue("bread1.png");
        this.foodLayer.addFoodToQueue("bread2.png");
        this.foodLayer.addFoodToQueue("bread3.png");
        this.scheduleUpdate();
        this.foodLayer.onStart();
    },

    update:function(dt) {
        if (this.foodLayer != null && this.foodLayer.isFinished()) {
            this.foodLayer.onFinish();
            this.removeChild(this.foodLayer);
            delete this.foodLayer;
        }
    },

    ovenDone:function(status) {
        cc.log(status);
    },

    onExit:function() {
        this.removeAllChildrenWithCleanup();
    }
});