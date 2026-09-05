function RenderingZone(x, y, w, h, func, obj) {
    this.isRenderingNeeded = true;
    this.renderingCore = obj ? function() { func(obj, x, y) } : function() { func(x, y) };

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.rendering = function() {
        if (!this.isRenderingNeeded) {
            return;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.renderingCore();
        this.isRenderingNeeded = false;
    }

    this.setRenderingOnEnter = function(x, y, w, h) {
        if (!this.isRenderingNeeded
            && x + w > this.x && x < this.x + this.w && y + h > this.y && y < this.y + this.h) {
                this.isRenderingNeeded = true;
            }
    }

    this.setRenderingNeeded = function() {
        this.isRenderingNeeded = true;
    }
}