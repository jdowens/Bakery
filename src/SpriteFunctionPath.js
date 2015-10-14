var SpriteFunctionPath = cc.ActionInterval.extend({
    initialX:0,
    initialY:0,
    functionX:null,
    functionY:null,
    curTime:0,
    returnHome:false,

    ctor:function(duration, functionX, functionY, returnHome) {
        this._super(duration);
        this.functionX = functionX;
        this.functionY = functionY;
        this.returnHome = returnHome;
    },

    update:function(dt) {
        // for some reason the dt comes in scaled by a factor of 32
        this.curTime += dt/32;
        cc.log("curTime: " + this.curTime + " Y Func: " + this.functionY(this.curTime));
        this.target.setPosition(cc.p(this.initialX + this.functionX(this.curTime),
            this.initialY + this.functionY(this.curTime)));
    },

    startWithTarget:function(target) {
        this._super(target);
        this.initialX = target.getPosition().x;
        this.initialY = target.getPosition().y;
    },

    stop:function() {
        if (this.returnHome)
            this.target.setPosition(this.initialX, this.initialY);
        this._super();
    }

});