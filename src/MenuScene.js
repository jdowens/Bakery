/**
 * Created by james on 10/8/2015.
 */
var MenuLayer = cc.Layer.extend({
    spriteOven:null,

    ctor:function() {
        this._super();
    },

    init:function() {
        this._super();

        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        var spritebg = new cc.Sprite(res.differentBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);

        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onPlay, this);
        var menu = new cc.Menu(menuItemPlay);
        menu.setPosition(centerpos);
        this.addChild(menu);

        this.spriteOven = new cc.Sprite(res.oven_png);
        this.spriteOven.setPosition(centerpos);
        this.addChild(this.spriteOven);

        var eventListener = {
            event: cc.EventListener.MOUSE,
            selected:false,

            onMouseDown:function(event) {
                var target = event.getCurrentTarget();

                var rect = new cc.Rect(target.spriteOven.getPosition().x - target.spriteOven.getTextureRect().width / 2,
                                       target.spriteOven.getPosition().y - target.spriteOven.getTextureRect().height / 2,
                                       target.spriteOven.getTextureRect().width,
                                       target.spriteOven.getTextureRect().height);
                var point = event.getLocation();
                if (cc.rectContainsPoint(rect, point)) {
                    cc.log("You clicked the sprite!");
                    this.selected = true;
                }
            },

            onMouseMove:function(event) {
                var target = event.getCurrentTarget();
                if (this.selected) {
                    target.spriteOven.x = event.getLocation().x;
                    target.spriteOven.y = event.getLocation().y;
                }
            },

            onMouseUp:function(event) {
                this.selected = false;
            }
        };

        cc.eventManager.addListener(eventListener, this);
    },

    onPlay:function() {
        cc.log("You clicked the play button, good job...");
        ImCoolFunc("Kyle");
        ImCoolFunc("Nick");
        ArraysAreFun();
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function() {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});

var ImCoolFunc = function(whoscool) {
    cc.log(whoscool + " is cool!");
};

var ArraysAreFun = function() {
    var table = {
        month:10,
        name:"James",
        print:function() {
            cc.log("The month is " + this.month);
            cc.log("My name is " + this.name);
            this.month = "October";
            cc.log("The month is " + this.month);
        }
    };
    table.print();
};