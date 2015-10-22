/**
 * Created by james on 10/14/2015.
 * Used reference from http://www.frozax.com/blog/2012/02/how-to-create-shake-action-cocos2d-x-source-code/
 * All credit to frozax
 */
var SpriteShake = cc.ActionInterval.extend({
    initialX:0,
    initialY:0,
    strengthX:0,
    strengthY:0,

    ctor:function(duration, strengthX, strengthY) {
        this._super(duration);
        this.strengthX = strengthX;
        this.strengthY = strengthY;
    },

    update:function(dt) {
        var randx = this.initialX + (Math.random() - 0.5)*2*this.strengthX;
        var randy = this.initialY + (Math.random() - 0.5)*2*this.strengthY;
        this.target.setPosition(cc.p(randx, randy));
    },

    startWithTarget:function(target) {
        this._super(target);
        this.initialX = target.getPosition().x;
        this.initialY = target.getPosition().y;
    },

    stop:function() {
        this.target.setPosition(this.initialX, this.initialY);
        this._super();
    }

});