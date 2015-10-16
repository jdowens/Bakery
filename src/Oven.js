var Oven = cc.Sprite.extend({
    available:true,
    statusBar:null,
    statusBarBackground:null,
    elapsedTime:0,
    requiredTime:0,
    finishedBakingCallback:null,

    ctor:function(resource, caller, finishedBakingCallback) {
        this._super(resource);
        var cb = finishedBakingCallback.bind(caller);
        this.finishedBakingCallback = cb;
        this.setupMouseCallbacks();
        this.statusBarBackground = new cc.Sprite(res.ovenBarBackground_png);
        var rect = this.getBoundingBoxToWorld();
        cc.log(rect.x, rect.y, rect.width, rect.height);
        var y_offset = this.statusBarBackground.getBoundingBoxToWorld().height / 2;
        this.statusBarBackground.setPosition(cc.p(rect.width / 2,rect.height + y_offset));
        this.addChild(this.statusBarBackground);

        this.statusBar = new cc.ProgressTimer(new cc.Sprite(res.red_button13_png));
        this.statusBar.setType(cc.ProgressTimer.TYPE_BAR);
        this.statusBar.setMidpoint(cc.p(0, 0.5));
        this.statusBar.setBarChangeRate(cc.p(1,0));
        this.statusBar.setPosition(cc.p(this.statusBar.getBoundingBoxToWorld().width / 2,
            this.statusBar.getBoundingBoxToWorld().height / 2));
        this.statusBarBackground.addChild(this.statusBar);

        this.statusBar.setPercentage(0);
    },

    setupMouseCallbacks:function() {
        var listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onOvenRequest(event.getLocation());
            }
        });
        cc.eventManager.addListener(listener, this);
    },

    onOvenRequest:function(position) {
        var rect = this.getBoundingBoxToWorld();
        if (!this.available && cc.rectContainsPoint(rect, position)) {
            var status = this.removeFood();
            this.finishedBakingCallback(status);
        }
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
        this.statusBar.setPercentage((this.elapsedTime/this.requiredTime)*50);
    },

    // returns the percent error off of perfect time
    removeFood:function() {
        if (!this.available) {
            this.unscheduleUpdate();
            this.available = true;
            this.statusBar.setPercentage(0);
            var perror = ((this.elapsedTime - this.requiredTime) / this.requiredTime);
            if (Math.abs(perror) <= 0.05) {
                return Oven.FoodStatus.COOKED;
            }
            else if (perror < -0.05) {
                return Oven.FoodStatus.UNDERCOOKED;
            }
            else if (perror > -0.05) {
                return Oven.FoodStatus.OVERCOOKED;
            }
        }
    }
});

// constants
Oven.FoodStatus = [];
Oven.FoodStatus.UNDERCOOKED = -1;
Oven.FoodStatus.COOKED = 0;
Oven.FoodStatus.OVERCOOKED = 1;