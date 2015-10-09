/**
 * Created by james on 10/8/2015.
 */
// MenuLayer data type deceleration (inherits from cc.Layer)
var MenuLayer = cc.Layer.extend({
    spriteOven:null,            // sprite for the oven
                                // must store under MenuLayer for access in event listener

    // constructor for MenuLayer
    ctor:function() {
        // call constructor of the cc.Layer class
        this._super();
    },

    // initialization function (setup sprites and button)
    init:function() {
        // call initialization function for cc.Layer
        this._super();

        // grab window size and calculate center of window
        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        // create sprite for background image and add to layer
        var spritebg = new cc.Sprite(res.differentBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        // set menu item font size
        cc.MenuItemFont.setFontSize(60);

        // create button
        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onPlay, this);
        // create menu container and add button to menu
        var menu = new cc.Menu(menuItemPlay);
        menu.setPosition(centerpos);
        // add menu to layer
        this.addChild(menu);

        // create draggable oven sprite and add to layer
        this.spriteOven = new cc.Sprite(res.oven_png);
        this.spriteOven.setPosition(centerpos);
        this.addChild(this.spriteOven);

        // setup event listener for mouse input
        var eventListener = {
            // need to tell cocos that we are listening for mouse input
            event: cc.EventListener.MOUSE,
            // state of the sprite (false means not clicked on)
            selected:false,
            // when mouse is clicked this function is called
            onMouseDown:function(event) {
                // event.getCurrentTarget tells where the event is being processed,
                // in this case it will be the MenuLayer
                var target = event.getCurrentTarget();

                // grab the bounds of the oven sprite
                //  <   WIDTH       >
                //  | | | | | | | | |<
                //  |               |H
                //  |               |G
                //  |               |T
                //  |               |>
                //  O | | | | | | | |
                // O - represents the origin (x,y)
                var rect = new cc.Rect(target.spriteOven.getPosition().x - target.spriteOven.getTextureRect().width / 2,
                                       target.spriteOven.getPosition().y - target.spriteOven.getTextureRect().height / 2,
                                       target.spriteOven.getTextureRect().width,
                                       target.spriteOven.getTextureRect().height);

                // grab where the mouse was clicked in screen coordinates
                var point = event.getLocation();
                // check if the rect contains the point
                if (cc.rectContainsPoint(rect, point)) {
                    cc.log("You clicked the sprite!");
                    // if true, the sprite is selected
                    this.selected = true;
                }
            },

            // when the mouse is moved
            onMouseMove:function(event) {
                // event.getCurrentTarget tells where the event is being processed,
                // in this case it will be the MenuLayer
                var target = event.getCurrentTarget();
                // if the sprite is selected
                if (this.selected) {
                    // move the sprite to where the mouse has moved
                    target.spriteOven.x = event.getLocation().x;
                    target.spriteOven.y = event.getLocation().y;
                }
            },

            // when mouse is released, set selected to false
            onMouseUp:function(event) {
                this.selected = false;
            }
        };

        // add listener to the cc.eventManager
        cc.eventManager.addListener(eventListener, this);
    },

    // callpack for the play button
    onPlay:function() {
        // make a log entry
        cc.log("You clicked the play button, good job...");
        // call some random functions
        ImCoolFunc("Kyle");
        ImCoolFunc("Nick");
        ArraysAreFun();
    }
});

// MenuScene object decleration (inherits from cc.Scene)
var MenuScene = cc.Scene.extend({
    // this function is called whenever the director loads the scene
    onEnter:function() {
        // call parent function (cc.Scene.onEnter)
        this._super();
        // create a new MenuLayer
        var layer = new MenuLayer();
        // initialize the layer
        layer.init();
        // add the layer to the Scene to allow it to be drawn
        this.addChild(layer);
    }
});

// random free functions
var ImCoolFunc = function(whoscool) {
    cc.log(whoscool + " is cool!");
};

var ArraysAreFun = function() {
    // example of a table
    var table = {
        month:10,                                       // integer
        name:"James",                                   // string
        print:function() {                              // function pointer
            cc.log("The month is " + this.month);
            cc.log("My name is " + this.name);
            this.month = "October";
            cc.log("The month is " + this.month);
        }
    };
    // call table.print() method
    table.print();
};