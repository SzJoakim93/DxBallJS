var brickWidth = 30;
var brickHeight = 15;
var brickOffsetTop = 45;
var brickOffsetLeft = 20;
var maxBrickInRow = 20;
var maxBrickInColumn = 21;
var fire_brick = 25;
var strong_brick = 24;
var little_strong_brick = 23;
var undestroyable_brick = 20;
var undestroyable_brick_hitable = 21;
var invisible_brick = 27;
var fireAnimation = new Animation("GFX/Brick" + (fire_brick + 1).toString() + ".png", 1, 5, brickWidth, brickHeight, 10);

var bricksRemaining = 0;
var undestroyableBickHits = 0;

function Brick(x, y, textureId, life, destroyable) {
    this.x = x;
    this.y = y;
    this.textureId = textureId;
    this.life = life;
    this.destroyable = destroyable;
    this.status = 100;
    this.isDrawNeeded = true;

    if (this.destroyable) {
        bricksRemaining++;
    }

    this.drawFire = function () {
        if (this.status > 0) {
            if (this.status < 100) {
                this.status -= 10;
                ctx.globalAlpha = this.status / 100;
            }
            this.fireAnim.applyAnim();
            ctx.globalAlpha = 1.0;
        }

        this.explosionTime.handleEvent();
    }

    this.drawNormal = function () {
        if (this.status <= 0 || this.textureId === invisible_brick || (!this.isDrawNeeded && this.status === 100) || !level.brickImg[this.textureId] || !level.brickImg[this.textureId].complete) {
            return;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, brickWidth, brickHeight);

        if (this.status > 0) {
            if (this.status < 100) {
                this.status -= 10;
                ctx.globalAlpha = this.status / 100;
            }

            ctx.drawImage(level.brickImg[this.textureId], this.x, this.y);
            ctx.globalAlpha = 1.0;
        }

        this.explosionTime.handleEvent();
        this.isDrawNeeded = false;
    }

    if (this.textureId === fire_brick || this.textureId === -1) {
        this.fireAnim = new Animator(fireAnimation, x, y, null, null);
        this.draw = this.drawFire;
    } else {
        this.draw = this.drawNormal;
    }

    this.fallDown = function () {
        this.y += brickHeight;
        if (this.fireAnim) {
            this.fireAnim.y += brickHeight;
        }
    };

    this.switchToFireBrick = function () {
        if (!this.destroyable) {
            this.destroyable = true;
            bricksRemaining++;
        }
        this.textureId = fire_brick;
        this.fireAnim = new Animator(fireAnimation, this.x, this.y, null, null);
        this.draw = this.drawFire;
        this.life = 1;
    }

    this.collision = function (i) {
        if (this.status === 100) {
            if (inGame.ball[i].x + player.ballRadius > this.x && inGame.ball[i].x < this.x + brickWidth && inGame.ball[i].y + player.ballRadius > this.y && inGame.ball[i].y < this.y + brickHeight) {

                if (!player.isMegaBall) {
                    var x = ((this.x + brickWidth / 2.0) - inGame.ball[i].x - (player.ballRadius / 2.0));
                    var y = ((this.y + brickHeight / 2.0) - inGame.ball[i].y - (player.ballRadius / 2.0));
                    var degree = y / x;
                    if (degree > -0.5 && degree < 0.5) {
                        if ((x > 0 && inGame.ball[i].dx > 0) || (x < 0 && inGame.ball[i].dx < 0)) {
                            inGame.ball[i].dx = -inGame.ball[i].dx;
                        }
                    } else {
                        if ((y > 0 && inGame.ball[i].dy > 0) || (y < 0 && inGame.ball[i].dy < 0)) {
                            inGame.ball[i].dy = -inGame.ball[i].dy;
                        }
                    }
                }

                this.hit()
                inGame.ball[i].speedUp();
            }
        }
    }

    this.collisionByAmmo = function (i) {
        if (this.status == 100 && inGame.ammos[i].x > this.x && inGame.ammos[i].x < this.x + brickWidth && inGame.ammos[i].y > this.y && inGame.ammos[i].y < this.y + brickHeight) {
            this.hit();

            if (!player.isMegaBall) {
                inGame.ammos[i].drImg.clear();
                inGame.ammos.splice(i, 1);
            }
            return true;
        }

        return false;
    }

    this.redrawOnOverlapping = function (x, y, w, h) {
        if (!this.isDrawNeeded
            && x + w > this.x && x < this.x + brickWidth && y + h > this.y && y < this.y + brickHeight) {
            this.isDrawNeeded = true;
        }
    }

    this.destroyAroundBricks = function () {
        for (var i = 0; i < inGame.bricks.length; i++) {
            if (inGame.bricks[i].status === 100 && Math.abs(inGame.bricks[i].x - this.x) <= brickWidth && Math.abs(inGame.bricks[i].y - this.y) <= brickHeight) {
                inGame.bricks[i].dropBonus();
                inGame.bricks[i].destroy();
                if (inGame.bricks[i].textureId === fire_brick) { //fire brick
                    inGame.fire.play();
                    explosion.addExplosion(inGame.bricks[i].x, inGame.bricks[i].y);
                    inGame.bricks[i].explosionTime.launch();
                }
            }
        }
    }

    this.hit = function () {
        if (player.isFireBall) {
            this.switchToFireBrick();
            this.life = 1;
            this.destroyable = 1;
        }

        if (this.life > 0) {
            this.life--;
        }

        if (this.life === 0) {
            if (this.destroyable) { //on destroyable brick
                this.dropBonus();
                this.undestroyableBickHits = 0;
                this.destroy();
                if (this.textureId === fire_brick) { //fire brick
                    inGame.fire.play();
                    explosion.addExplosion(this.x, this.y);
                    this.explosionTime.launch();
                } else {
                    inGame.hitBrickSnd.play();
                }
            } else { //on undestroyable brick
                inGame.hitBrickSnd3.play();
                undestroyableBickHits++;
                if (undestroyableBickHits >= 20) {
                    for (var i = 0; i < inGame.bricks.length; i++) {
                        inGame.bricks[i].makeOnceHit();
                    }
                    undestroyableBickHits = 0;
                }
            }

        } else { //on hit
            if (this.textureId === invisible_brick) {
                inGame.hitBrickSnd4.play();
            } else {
                inGame.hitBrickSnd2.play();
            }
            this.textureId--;
            player.score += 2;
            inGame.renderingZones["Score"].setRenderingNeeded();
        }

        this.isDrawNeeded = true;
        particleManager.addParticle(this.x + brickWidth / 2, this.y + brickHeight / 2, 6, 15, false);
    }

    this.makeOnceHit = function () {
        if (this.life > 1) {
            this.textureId -= this.life - 1;
        }

        if (!this.destroyable) {
            this.destroyable = true;
            this.textureId = undestroyable_brick;
        }
        this.life = 1;
        this.undestroyableBickHits = 0;
    }

    this.destroy = function () {
        this.status = 90;
        player.score += 10;
        inGame.renderingZones["Score"].setRenderingNeeded();
        bricksRemaining--;
        if (bricksRemaining < 4) {
            inGame.thunderTimeout.launch();
        }
    }

    this.dropBonus = function () {
        if (inGame.bonusCoolDown > 0) {
            return;
        }

        inGame.bonusDropCounter--;

        if (inGame.bonusDropCounter <= 0) {
            inGame.bonusDropCounter = getBonusDropCounter();
            inGame.bonusCoolDown = 50;

            if (inGame.ball.length > 0) {
                dx = inGame.ball[0].dx;
                dy = inGame.ball[0].dy;
            } else {
                dx = Math.floor(Math.random() * 2) - 1;
                dy = Math.floor(Math.random() * 2) - 1;
            }
            inGame.bonuses[inGame.bonuses.length] = new Bonus(this.x, this.y, dx, dy);
            inGame.bankSnd.play();
        }
    }

    this.getRawX = function () {
        return Math.floor((this.x - brickOffsetLeft) / brickWidth);
    }

    this.getRawY = function () {
        return Math.floor((this.y - brickOffsetTop) / brickHeight);
    }

    this.explosionTime = new TimeoutEvent(5, function (obj) { obj.destroyAroundBricks() }, this);
}

function redrawBricksOnOverlapping(x, y, w, h) {
    for (var i = 0; i < inGame.bricks.length; i++) {
        inGame.bricks[i].redrawOnOverlapping(x, y, w, h);
    }
}
