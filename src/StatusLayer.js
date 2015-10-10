var StatusLayer = cc.Layer.extend({
    labelMoney:null,
    labelEarned:null,
    labelTime:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        var winsize = cc.director.getWinSize();

        this.labelMoney = new cc.LabelTTF("Dat phat bank: 0", "Helvetica", 20);
        //this.labelMoney.setColor(cc.color(0,0,0));
        this.labelMoney.setPosition(cc.p(100, winsize.height - 20));
        this.addChild(this.labelMoney);

        this.labelEarned = new cc.LabelTTF("+ 0", "Helvetica", 20);
        this.labelEarned.setColor(cc.color(0,0,0));
        this.labelEarned.setPosition(cc.p(0,0));
        this.labelEarned.setOpacity(0);
        this.addChild(this.labelEarned);

        this.labelTime = new cc.LabelTTF("Time: ", "Hevlevtica", 20);
        //this.labelTime.setColor(cc.color(0,0,0));
        this.labelTime.setPosition(cc.p(winsize.width / 2, winsize.height - 20));
        this.addChild(this.labelTime);
    },

    updateText:function(actionLayer) {
        this.labelMoney.setString("Dat phat bank: " + actionLayer.money);
        var timeDisplay = actionLayer.remainingTime.toFixed(1);
        this.labelTime.setString("Time: " + timeDisplay);
    },

    spawnEarnedText:function(amount, point) {
        this.labelEarned.setString("+ " + amount);
        this.labelEarned.setOpacity(255);
        var fadeOut = new cc.fadeOut(2.0);
        this.labelEarned.runAction(fadeOut);
        this.labelEarned.setPosition(point);
    }
});