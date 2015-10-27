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



var MenuLayer2 = cc.Layer.extend({

    ctor:function(){
        this._super();
    },

    init:function(){

        this._super();

        var menuitems = 5;                                                                                  // The number of items/buttons on menu (subject to change)
        var winsize = cc.director.getWinSize();
        var playPos = cc.p(winsize.width / 2, winsize.height * ((menuitems) / (menuitems + 1)));            // The position of button 1 (Now top down)
        var contPos = cc.p(winsize.width / 2, winsize.height * ((menuitems - 1) / (menuitems + 1)));
        var drcsPos = cc.p(winsize.width / 2, winsize.height * ((menuitems - 2) / (menuitems + 1)));
        var optPos = cc.p(winsize.width / 2, winsize.height * ((menuitems - 3) / (menuitems + 1)));
        var exitPos = cc.p(winsize.width / 2, winsize.height * ((menuitems - 4) / (menuitems + 1)));        // More buttons can be added by following this format

        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        var spritebg = new cc.Sprite(res.differentBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);            // What does this do?

        var menuItemPlay = new cc.MenuItemSprite(           // Create button 1 : Play
            new cc.Sprite(res.Pictures_Menu_stdPlay_png),
            new cc.Sprite(res.Pictures_Menu_actPlay_png),
            this.onPlay, this);

        var play = new cc.Menu(menuItemPlay);               // Menu container for button 1
        play.setPosition(playPos);
        this.addChild(play);

        var menuItemHiScores = new cc.MenuItemSprite(       // Create button 2: HiScores
            new cc.Sprite(res.Pictures_Menu_stdHiScores_png),
            new cc.Sprite(res.Pictures_Menu_actHiScores_png),
            this.onHiScores, this);

        var cont = new cc.Menu(menuItemHiScores);           // Menu container for button 2
        cont.setPosition(contPos);
        this.addChild(cont);

        var menuItemDirections = new cc.MenuItemSprite(       // Create button 3: Directions
            new cc.Sprite(res.Pictures_Menu_stdDirections_png),
            new cc.Sprite(res.Pictures_Menu_actDirections_png),
            this.onDirections, this);

        var drcs = new cc.Menu(menuItemDirections);           // Menu container for button 3
        drcs.setPosition(drcsPos);
        this.addChild(drcs);

        var menuItemOptions = new cc.MenuItemSprite(        // Options
            new cc.Sprite(res.Pictures_Menu_stdOptions_png),
            new cc.Sprite(res.Pictures_Menu_actOptions_png),
            this.onOptions, this);

        var opt = new cc.Menu(menuItemOptions);            // Menu container
        opt.setPosition(optPos);
        this.addChild(opt);

        var menuMenuExit = new cc.MenuItemSprite(           // Exit
            new cc.Sprite(res.Pictures_Menu_stdExit_png),
            new cc.Sprite(res.Pictures_Menu_actExit_png),
            this.onMenuExit, this);

        var exit = new cc.Menu(menuMenuExit);               // Menu container
        exit.setPosition(exitPos);
        this.addChild(exit);
    },

    onPlay:function(){                                          // These show that the different buttons are activated
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        cc.log("You clicked the play button, good job...");
        cc.director.runScene(new PlayScene());
    },

    onHiScores:function() {
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        cc.log("You clicked the hi scores button, good job...");
        window.open("http://dropthenet.com/hiscores.html");
        //cc.director.runScene(new HiScoreScene());
    },

    onDirections:function() {
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        cc.log("You clicked the directions button, good job...");
    },

    onOptions:function(){
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        cc.log("You clicked the options button, good job...");
		cc.log("Extra debug info...");
        cc.director.runScene(new OptionsScene());
    },

    onMenuExit:function() {
        cc.log("You clicked the exit button, good job...");
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        window.location.replace("http://dropthenet.com/index.php/cute-bakery/");
    }
});

var MenuScene2 = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MenuLayer2();
        layer.init();
        this.addChild(layer);


    }
});



