var particleImg = new Image();
particleImg.src = "GFX/Particle.png";
var particleRadius = 2;

function Particle(x, y, dx, dy, lifeTime, isGravity) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.drImage = new DRImage(particleImg, redrawOverlappingElements);
    this.lifeTime = lifeTime;
    this.isGravity = isGravity;

    this.apply = function() {
        if (this.lifeTime < 0) {
            return;
        }

        if (isGravity) {
            if (this.dy < 4) {
                this.dy += 0.1;
            }

            if (this.dx < 0) {
                this.dx += 0.05;
            } else if (this.dx > 0) {
                this.dx -= 0.05;
            }
        }

        this.x += this.dx;
        this.y += this.dy;

        this.drImage.draw(this.x, this.y);

        this.lifeTime --;
    }
}

function ParticleSystem(x, y, speed, lifeTime, isHalfDir) {
    this.particles = [];
    for (var i = 0; i < 40; i++) {
        var verticalDir = isHalfDir ? -Math.floor(Math.random() * speed) : Math.floor(Math.random() * speed) - speed/2;
        this.particles.push(new Particle(x, y, Math.floor(Math.random() * speed) - speed/2, verticalDir, lifeTime, false));
    }

    this.apply = function() {
        for (var i = 0; i < this.particles.length; i++) {
            if (this.particles[i].lifeTime < 0) {
                this.particles[i].drImage.clear();
                this.particles.splice(i, 1);
            } else {
                this.particles[i].apply();
            }
        }
    }
}

function ParticleManager() {
    this.particles = [];

    this.addParticle = function(x, y, speed, lifeTime, isHalfDir) {
        this.particles.push(new ParticleSystem(x, y, speed, lifeTime, isHalfDir));
    }

    this.apply = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].apply();
            if (this.particles[i].particles.length === 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}