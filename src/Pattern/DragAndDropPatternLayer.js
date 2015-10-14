var DragAndDropPatternLayer = Pattern.extend({
    spriteTarget:null,
    spriteDestination:null,
    actionLayer:null,
    selected:false,
    drugFrom:null,

    ctor:function(spriteTarget, spriteDestination) {
        this._super();
        this.spriteTarget = spriteTarget;
        this.spriteDestination = spriteDestination;
    },

    onStart:function(layer) {
        this._super(layer);
        if ('mouse' in cc.sys.capabilities) {
            this.setupMouseCallbacks();
        }
        else if ('touches' in cc.sys.capabilities) {
            this.setupTouchCallbacks();
        }
    },

    setupMouseCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event) {
                var target = event.getCurrentTarget();
                target.onDragBegin(event.getLocation());
            },
            onMouseMove:function(event) {
                var target = event.getCurrentTarget();
                target.onDrag(event.getLocation());
            },
            onMouseUp:function(event) {
                var target = event.getCurrentTarget();
                target.onDragEnd(event.getLocation());
            }
        });

        cc.eventManager.addListener(this.listener, this);
    },

    setupTouchCallbacks:function() {
        this.listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onDragBegin(touch.getLocation());
                return true;
            },
            onTouchMoved:function(touch, event) {
                var target = event.getCurrentTarget();
                target.onDrag(touch.getLocation());
            },
            onTouchEnded:function(tourch, event) {
                var target = event.getCurrentTarget();
                target.onDragEnd(touch.getLocation());
            }
        });
    },

    onDragBegin:function(pos) {
        var rect = this.spriteTarget.getBoundingBoxToWorld();
        if (cc.rectContainsPoint(rect, pos)) {
            this.selected = true;
            this.drugFrom = new cc.p(pos.x, pos.y);
        }
    },

    onDrag:function(pos) {
        if (this.selected) {
            this.spriteTarget.x = pos.x;
            this.spriteTarget.y = pos.y;
        }
    },

    onDragEnd:function(pos) {
        var rect = this.spriteDestination.getBoundingBoxToWorld();
        if (this.selected && cc.rectContainsPoint(rect, pos)) {
            if (this.spriteDestination.available) {
                cc.audioEngine.playEffect("res/SFX/Powerup18.wav", false);
                this.finished = true;
            }
            else {
                this.spriteTarget.setPosition(this.drugFrom);
            }
        }
        this.selected = false;
    },

    onFinish:function() {
        this._super();
        this.spriteDestination.startBaking(Math.random() + 2.0);
    },

    isFinished:function() {
        return this.finished;
    }

});