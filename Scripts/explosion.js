function Explosion() {
    this.explosionAnim = new Animation("GFX/Explosion.png", 2, 3, 30, 15, 30);
    this.explosions = [];

    this.addExplosion = function(x, y) {
        this.explosions.push(new Animator(this.explosionAnim, x, y, null, null));
    }

    this.applyExplosions = function() {
        for (var i = 0; i < this.explosions.length; i++) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.explosions[i].x, this.explosions[i].y, 30, 15);

            if (this.explosions[i].currClip >= this.explosions[i].animation.clips.length - 1) {
                this.explosions.splice(i, 1);
            } else {
                this.explosions[i].applyAnim();
            }
        }
    }
}