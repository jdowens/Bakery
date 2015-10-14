/**
 * Created by james on 10/14/2015.
 */

var Pattern = cc.Layer.extend({
    finished:false,
    listener:null,
    actionLayer:null,

    ctor:function() {
        this._super();
    },

    onStart:function(layer) {
        this.actionLayer = layer;
    },

    onFinish:function() {
        if (this.listener !== null)
            cc.eventManager.removeListener(this.listener);
    },

    isFinished:function() {
        return this.finished;
    }
});

// pattern is inheritable
Pattern.extend = cc.Class.extend;