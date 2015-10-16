/**
 * Created by james on 10/8/2015.
 */
// MenuLayer data type deceleration (inherits from cc.Layer)
var OptionsLayer = cc.Layer.extend({
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

        // create button for return to main menu
        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.Pictures_Menu_stdReturn_png),
            new cc.Sprite(res.Pictures_Menu_actReturn_png),
            this.onReturn, this);
        // create menu container and add button to menu
        var menu = new cc.Menu(menuItemPlay);
        menu.setPosition(cc.p(centerpos.x, centerpos.y - 200));
        // add menu to layer
        this.addChild(menu);

        // create music volume slider
        var slider = new cc.ControlSlider(res.red_button10_png, res.red_button13_png, res.red_sliderDown_png);
        slider.setPosition(cc.p(centerpos.x, centerpos.y + 25));
        slider.setEnabled(true);
        slider.setMinimumAllowedValue(0);
        slider.setMaximumValue(1);
        slider.setValue(cc.audioEngine.getMusicVolume());
        slider.addTargetWithActionForControlEvents(this, this.onMusicValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
        this.addChild(slider);
        var text = new cc.LabelTTF("Music: ", "Helvetica", 30);
        text.setPosition(cc.p(centerpos.x - 150, centerpos.y + 25));
        this.addChild(text);

        // create sfx volume slider
        var slider2 = new cc.ControlSlider(res.red_button10_png, res.red_button13_png, res.red_sliderDown_png);
        slider2.setPosition(cc.p(centerpos.x, centerpos.y - 25));
        slider2.setEnabled(true);
        slider2.setMinimumAllowedValue(0);
        slider2.setMaximumValue(1);
        slider2.setValue(cc.audioEngine.getEffectsVolume());
        slider2.addTargetWithActionForControlEvents(this, this.onSFXValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
        this.addChild(slider2);
        var text2 = new cc.LabelTTF("SFX: ", "Helvetica", 30);
        text2.setPosition(cc.p(centerpos.x - 150, centerpos.y - 25));
        this.addChild(text2);
    },

    // callback for the return button
    onReturn:function() {
        cc.audioEngine.playEffect("res/SFX/Menu/FerchenOven.m4a", false);
        cc.director.runScene(new MenuScene2());
    },

    onMusicValueChanged:function(event) {
        cc.audioEngine.setMusicVolume(event.value);
    },

    onSFXValueChanged:function(event) {
        cc.audioEngine.setEffectsVolume(event.value);
        cc.audioEngine.playEffect("res/SFX/Laser_Shoot4.wav", false);
    }
});

// MenuScene object decleration (inherits from cc.Scene)
var OptionsScene = cc.Scene.extend({
    // this function is called whenever the director loads the scene
    onEnter:function() {
        // call parent function (cc.Scene.onEnter)
        this._super();
        // create a new MenuLayer
        var layer = new OptionsLayer();
        // initialize the layer
        layer.init();
        // add the layer to the Scene to allow it to be drawn
        this.addChild(layer);
    }
});

