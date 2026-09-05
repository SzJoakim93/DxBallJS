var bonusRadius = 31;
var maxBonusIds = [8, 2, 5, 3];

bonusImg = [];
for (var i = 0; i < 4; i++) {
    bonusImg[i] = [];
    for (var j = 0; j < maxBonusIds[i]; j++) {
        bonusImg[i][j] = new Image();
        bonusImg[i][j].src = "GFX/Bonus" + (i + 1).toString() + "." + (j + 1).toString() + ".png";
    }
}

function Bonus(x, y, dx, dy) {
    this.group = getGroupId(Math.floor(Math.random() * 56));
    this.id = Math.floor(Math.random() * maxBonusIds[this.group]);
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.status = 1;
    this.drImage = new DRImage(bonusImg[this.group][this.id], redrawOverlappingElements);

    this.update = function () {
        if (this.status) {
            this.x += this.dx;
            this.y += this.dy;
            if (this.dy < 4) {
                this.dy += 0.1;
            }

            if (this.dx < 0) {
                this.dx += 0.05;
            } else if (this.dx > 0) {
                this.dx -= 0.05;
            }

            if (this.x + this.dx > ctx.width - this.bonusRadius - 20 || this.x + this.dx < 20) {
                this.dx = -this.dx;
                inGame.hitWallSnd.play();
            }

            this.pickupBonus();

            if (this.y > canvas.height) {
                this.drImage.clear();
                inGame.bonuses.splice(inGame.bonuses.indexOf(this), 1);
            }
        }
    }

    this.draw = function () {
        if (this.status) {
            this.drImage.draw(this.x, this.y);
        } else {
            this.drImage.clear();
            inGame.bonuses.splice(inGame.bonuses.indexOf(this), 1);
        }
    }

    this.pickupBonus = function () {
        if (this.y > canvas.height - bonusRadius - paddleHeight - 6 &&
            this.x + bonusRadius > inGame.paddle.x && this.x < inGame.paddle.x + inGame.paddle.w) {
            bonusEvents[this.group][this.id]();
            this.status = 0;
            player.score += 40;
            inGame.renderingZones["Score"].setRenderingNeeded();
        }
    }
}

function getGroupId(x) {
    if (x < 16) { //0-15 (16)
        return 0;
    } else if (x === 16) { //16 (1)
        return 1;
    } else if (x < 41) { //17-40
        return 2;
    } else if (x < 57) {//41-56
        return 3;
    }
}
