function DRImage(img, redrawMethod) {
    this.img = img;
    this.prevX = null;
    this.prevY = null;

    this.draw = function(x, y) {
        ctx.fillStyle = "black";
        if (this.prevX != null && this.prevY != null) {
            ctx.fillRect(Math.floor(this.prevX), Math.floor(this.prevY), this.img.width, this.img.height);
            if (redrawMethod) {
                redrawMethod(this.prevX, this.prevY, this.img.width, this.img.height);
            }
        }
        ctx.drawImage(this.img, Math.floor(x), Math.floor(y));
        this.prevX = x;
        this.prevY = y;
    }

    this.clear = function() {
            ctx.fillStyle = "black";
            ctx.fillRect(Math.floor(this.prevX), Math.floor(this.prevY), this.img.width, this.img.height);
            if (redrawMethod) {
                redrawMethod(this.prevX, this.prevY, this.img.width, this.img.height);
            }
    }
}