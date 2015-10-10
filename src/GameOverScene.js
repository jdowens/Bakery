var GameOverLayer = cc.Layer.extend({
    money:0,
    labelMoney:null,
    name:"",
    textBox:null,

    ctor : function() {
        this._super();
    },
    init:function() {
        this._super();

        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        var spritebg = new cc.Sprite(res.gameoverBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);

        var menuItemRestart = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onPlay, this);
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(cc.p(centerpos.x, centerpos.y - 100));
        this.addChild(menu);

        // setup name box
        this.textBox = new cc.EditBox(cc.size(200, 50), new cc.Scale9Sprite(res.red_button10_png), new cc.Scale9Sprite(res.red_button13_png));
        this.textBox.setFontColor(cc.color(0,0,0,255));
        this.textBox.setPosition(centerpos);
        this.addChild(this.textBox);
    },

    onPlay : function() {
        cc.log("==onRestart clicked");
        this.name = this.textBox.string;
        this.name = this.name.replace(/\s+/g, '');
        this.name = this.name.replace(/\?/g, '');
        if (this.name != "") {
            cc.log("http://dropthenet.com/cgi-bin/test.cgi?" + this.money + "?" + this.name);
            var post = window.open("http://dropthenet.com/cgi-bin/test.cgi?" + this.money + "?" + this.name);
            setTimeout(function () {
                post.close();
            }, 100);
        }
        this.name = "";
        this.textBox.string = "";
        cc.director.runScene(new MenuScene2());
    },

    setupLabel:function(money) {
        var winsize = cc.director.getWinSize();
        this.money = money;
        this.labelMoney = new cc.LabelTTF("You suck", "Helvetica", 30);
        this.labelMoney.setString("You suck\nMoney: " + this.money);
        //this.labelMoney.setColor(cc.color(0,0,0));
        this.labelMoney.setPosition(cc.p(winsize.width / 2, winsize.height - 100));
        this.addChild(this.labelMoney);
    }
});

var GameOverScene = cc.Scene.extend({
    gameOverLayer:null,
    money:0,
    ctor:function(money) {
        this._super();
        this.money = money;
    },

    onEnter:function() {
        this._super();
        this.gameOverLayer = new GameOverLayer();
        this.gameOverLayer.init();
        this.addChild(this.gameOverLayer);
        this.gameOverLayer.setupLabel(this.money);
    }
});