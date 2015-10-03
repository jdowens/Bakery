var PlayScene = cc.Scene.extend({
    backgroundLayer:null,
    actionLayer:null,
    statusLayer:null,

    onEnter:function() {
        this._super();
        this.scheduleUpdate();
        this.backgroundLayer = new BackgroundLayer();
        this.actionLayer = new TestCakeLayer();
        this.statusLayer = new StatusLayer();

        this.actionLayer.setStatusLayer(this.statusLayer);

        this.addChild(this.backgroundLayer);
        this.addChild(this.actionLayer);
        this.addChild(this.statusLayer);
    },

    update:function(dt) {
        this.statusLayer.updateText(this.actionLayer);
    }
});