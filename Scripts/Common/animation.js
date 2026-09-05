function Animation(imgSrc, clipCountX, clipCountY, clipWidth, clipHeight, speed, callBack) {
    this.image = new Image();
    this.image.src = imgSrc;
    this.clipWidth = clipWidth;
    this.clipHeight = clipHeight;
    this.clips = [];
    this.maxCyle = 100 / speed;
    this.callBack = callBack;

    for (var i = 0; i < clipCountY; i++) {
        for (var j = 0; j < clipCountX; j++) {
            this.clips.push({ x: clipWidth * j, y: clipHeight * i });
        }
    }

    this.applyAnim = function (x, y, w, h, i) {
        ctx.drawImage(this.image, this.clips[i].x, this.clips[i].y,
            this.clipWidth, this.clipHeight, Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    }
}

function Animator(animation, x, y, w, h, redrawMethod, callBackObj) {
    this.animation = animation;
    this.x = x;
    this.y = y;
    this.prevX = null;
    this.prevY = null;
    this.prevW = null;
    this.prevH = null;
    this.w = w !== null ? w : this.animation.clipWidth;
    this.h = h !== null ? h : this.animation.clipHeight;
    this.callBackObj = callBackObj;

    this.currClip = 0;
    this.currCyle = 0;

    this.applyAnim = function () {
        ctx.fillStyle = "black";
        if (this.prevX != null && this.prevY != null && (this.prevX !== this.x || this.prevY !== this.y || this.prevW !== this.w || this.prevH !== this.h)) {
            ctx.fillRect(Math.floor(this.prevX), Math.floor(this.prevY), Math.floor(this.prevW), Math.floor(this.prevH));
            if (redrawMethod) {
                redrawMethod(this.prevX, this.prevY, this.prevW, this.prevH);
            }
        }
        this.animation.applyAnim(this.x, this.y, this.w, this.h, this.currClip);
        this.applyPrevCoords();

        this.currCyle++;

        if (this.currCyle >= this.animation.maxCyle) {
            this.currClip++;
            this.currCyle = 0;
            if (this.currClip >= this.animation.clips.length) {
                this.currClip = 0;
                if (this.animation.callBack) {
                    if (this.callBackObj !== undefined) {
                        this.animation.callBack(this.callBackObj);
                    } else {
                        this.animation.callBack();
                    }
                }
            }
        }
    }
    
    this.clear = function() {
        ctx.fillStyle = "black";
        ctx.fillRect(Math.floor(this.prevX), Math.floor(this.prevY), Math.floor(this.prevW), Math.floor(this.prevH));
        if (redrawMethod) {
            redrawMethod(this.prevX, this.prevY, this.prevW, this.prevH);
        }
    }

    this.applyPrevCoords = function() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevW = this.w;
        this.prevH = this.h;
    }

    this.reset = function() {
        this.currCyle = 0;
        this.currClip = 0;
    }
}
