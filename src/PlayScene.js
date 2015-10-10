var PlayScene = cc.Scene.extend({
    backgroundLayer:null,
    actionLayer:null,
    statusLayer:null,

    onEnter:function() {
        this._super();
        this.scheduleUpdate();
        this.backgroundLayer = new BackgroundLayer();
        this.actionLayer = new TestClickAndHoldLayer();
        this.statusLayer = new StatusLayer();

        this.actionLayer.setStatusLayer(this.statusLayer);

        this.addChild(this.backgroundLayer);
        this.addChild(this.actionLayer);
        this.addChild(this.statusLayer);
    },

    update:function(dt) {
        if (this.actionLayer !== null)
        {
            this.actionLayer.addToTimer(-dt);
        }
        if (this.actionLayer !== null && this.actionLayer.remainingTime <= 0)
        {
            /*this.actionLayer.remainingTime = 0.0;
            this.statusLayer.updateText(this.actionLayer);
            this.removeChild(this.actionLayer);
            delete this.actionLayer;*/
            cc.director.runScene(new GameOverScene(this.actionLayer.money));
        }
        else if (this.actionLayer !== null)
            this.statusLayer.updateText(this.actionLayer);
    }
});