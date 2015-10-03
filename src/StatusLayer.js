var StatusLayer = cc.Layer.extend({
    labelMoney:null,
    labelClicksRemaining:null,
    labelEarned:null,

    ctor:function() {
        this._super();
        this.init();
    },

    init:function() {
        this._super();
        var winsize = cc.director.getWinSize();

        this.labelMoney = new cc.LabelTTF("Dat phat bank: 0", "Helvetica", 20);
        this.labelMoney.setColor(cc.color(0,0,0));
        this.labelMoney.setPosition(cc.p(100, winsize.height - 20));
        this.addChild(this.labelMoney);

        this.labelClicksRemaining = new cc.LabelTTF("Clicks Remaining: 0", "Helvetica", 20);
        this.labelClicksRemaining.setPosition(cc.p(winsize.width - 100, winsize.height - 20));
        this.addChild(this.labelClicksRemaining);

        this.labelEarned = new cc.LabelTTF("+ 0", "Helvetica", 20);
        this.labelEarned.setColor(cc.color._getYellow());
        this.labelEarned.setPosition(cc.p(0,0));
        this.labelEarned.setOpacity(0);
        this.addChild(this.labelEarned);
    },

    updateText:function(actionLayer) {
        this.labelClicksRemaining.setString("Remaining Clicks: " + actionLayer.remainingClicks);
        this.labelMoney.setString("Dat phat bank: " + actionLayer.money);
    },

    spawnEarnedText:function(amount, point) {
        this.labelEarned.setString("+ " + amount);
        this.labelEarned.setOpacity(255);
        var fadeOut = new cc.fadeOut(2.0);
        this.labelEarned.runAction(fadeOut);
        this.labelEarned.setPosition(point);
    }
});