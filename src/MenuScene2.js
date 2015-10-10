/**
 * Created by Kyle on 10/9/2015
 *
 * Goal is to create a menu scene that allows for 4 buttons to be evenly spaced
 * on a background
 * 4 buttons would pertain to; Play, Continue, Options, and Exit
 * I haven't GIMPed other buttons, this is just coding the spacing of the buttons
 * (I'm still not super clear on the inheritance in JS, advanced loops in JS, or how CC works but
 * this is my attempt to make a menu)
 *
 * Questions: should our function notation be "functionName" like online sources or
 *      "FunctionName" like previous example?
 *      What is variable notation? All lowercase? Or only first lowercase?
 *
 */



var MenuLayer = cc.Layer.extend({

    ctor:function(){
        this._super();
    },

    init:function(){

        this._super();

        var menuitems = 4;                                                                          // The number of items/buttons on menu (subject to change)
        var winsize = cc.director.getWinSize();
        var but1pos = cc.p(winsize.width / 2, winsize.height * (1 / (menuitems + 1)));                  // The position of button 1
        var but2pos = cc.p(winsize.width / 2, winsize.height * (2 / (menuitems + 1)));                  // Etc.
        var but3pos = cc.p(winsize.width / 2, winsize.height * (3 / (menuitems + 1)));
        var but4pos = cc.p(winsize.width / 2, winsize.height * (4 / (menuitems + 1)));

        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        var spritebg = new cc.Sprite(res.differentBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);            // What does this do?

        var menuItemPlay = new cc.MenuItemSprite(           // Create button 1 : Play
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onPlay, this);

        var play = new cc.Menu(menuItemPlay);               // Menu container for button 1
        play.setPosition(but1pos);
        this.addChild(play);

        var menuItemContinue = new cc.MenuItemSprite(       // Create button 2: Continue
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onContinue, this);

        var cont = new cc.Menu(menuItemContinue);           // Menu container for button 2
        cont.setPosition(but2pos);
        this.addChild(cont);

        var menuItemOptions = new cc.MenuItemSprite(        // Create button 3 : Options
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onOptions, this);

        var opt = new cc.Menu(menuItemOptions);            // Menu container for button 3
        opt.setPosition(but3pos);
        this.addChild(opt);

        var menuItemExit = new cc.MenuItemSprite(           // Create button 4: Exit
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png),
            this.onExit, this);

        var exit = new cc.Menu(menuItemExit);               // Menu container for button 4
        exit.setPosition(but4pos);
        this.addChild(exit);
    },

    onPlay:function(){                                          // These show that the different buttons are activated
        cc.log("You clicked the play button, good job...");
    },

    onContinue:function() {
        cc.log("You clicked the continue button, good job...")
    },

    onOptions:function(){
        cc.log("You clicked the options button, good job...");
    },

    onExit:function() {
        cc.log("You clicked the exit button, good job...")
    }
});

var MenuScene2 = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});


