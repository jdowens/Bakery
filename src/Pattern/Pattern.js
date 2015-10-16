var Pattern = cc.Layer.extend({
    finished:false,
    listener:null,
    actionLayer:null,
    onProgressVector:null,
    onCompletionVector:null,

    ctor:function() {
        this._super();
        this.onProgressVector = [];
        this.onCompletionVector = [];
    },

    addOnProgressAction:function(caller, func) {
        var boundFunc = func.bind(caller);
        this.onProgressVector.push(boundFunc);
    },

    addOnCompletionAction:function(caller, func) {
        var boundFunc = func.bind(caller);
        this.onCompletionVector.push(boundFunc);
    },

    onStart:function(layer) {
        this.actionLayer = layer;
    },

    onProgress:function() {
        for (var i = 0; i < this.onProgressVector.length; i++) {
            this.onProgressVector[i]();
        }
    },

    onCompletion:function() {
        for (var i = 0; i < this.onCompletionVector.length; i++) {
            this.onCompletionVector[i]();
        }
    },

    onFinish:function() {
        this.onCompletion();
        if (this.listener !== null)
            cc.eventManager.removeListener(this.listener);
    },

    isFinished:function() {
        return this.finished;
    }
});

// pattern is inheritable
Pattern.extend = cc.Class.extend;