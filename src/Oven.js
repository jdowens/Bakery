var Oven = cc.Sprite.extend({
    available:true,
    statusBar:null,
    elapsedTime:0,
    requiredTime:0,

    ctor:function(resource) {
        this._super(resource);
        this.statusBar = new cc.ProgressTimer(new cc.Sprite(res.red_button13_png));
        this.statusBar.setType(cc.ProgressTimer.TYPE_BAR);
        this.statusBar.setMidpoint(cc.p(0, 0.5));
        this.statusBar.setBarChangeRate(cc.p(1,0));
        var rect = this.getBoundingBoxToWorld();
        cc.log(rect.x, rect.y, rect.width, rect.height);
        var y_offset = this.statusBar.getSprite().getBoundingBoxToWorld().height / 2;
        this.statusBar.setPosition(cc.p(rect.width / 2,rect.height + y_offset));
        this.addChild(this.statusBar);
        this.statusBar.setPercentage(0);
    },

    startBaking:function(requiredTime) {
        this.scheduleUpdate();
        this.available = false;
        this.requiredTime = requiredTime;
        this.elapsedTime = 0;
    },

    update:function(dt) {
        this._super();
        this.elapsedTime += dt;
        this.statusBar.setPercentage((this.elapsedTime/this.requiredTime)*100);
    },

    // returns the percent error off of perfect time
    removeFood:function() {
        if (!this.available) {
            this.unscheduleUpdate();
            this.available = true;
            this.statusBar.setPercentage(0);
            return Math.abs((this.elapsedTime - this.requiredTime) / this.requiredTime);
        }
    }
});