var MultiClickPattern = cc.Class.extend({
    type:"MultiClickPattern",
    clicksRequired:0,
    clicksRemaining:0,
    alive:false,
    rect:null,
    layer:null,

    ctor:function(clicksRequired, rect, layer) {
        this.clicksRequired = clicksRequired;
        this.clicksRemaining = clicksRequired;
        this.rect = rect;
        this.layer = layer;
        cc.log(rect.x, rect.y, rect.width, rect.height);
    },

    checkPosition:function(point) {
        cc.log("Checking position of point " + point.x + ' ' + point.y);
        if (cc.rectContainsPoint(this.rect, point))
        {
            cc.log("Point hit!");
            this.clicksRemaining--;
            if (this.clicksRemaining <= 0) {
                this.clicksRemaining = 0;
                this.layer.spriteSheet.removeChild(this.layer.patternSprite);
                this.alive = false;
            }
            cc.log("Clicks remaining " + this.clicksRemaining);
        }
    },

    setAlive:function(bool)
    {
        this.alive = bool;
    },

    getAlive:function()
    {
        return this.alive;
    }

});