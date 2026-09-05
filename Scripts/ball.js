var MAX_SPEED = 12;
var ballImg = [];
for (var i = 0; i < 3; i++) {
    ballImg[i] = [];
    for (var j = 0; j < 3; j++) {
        ballImg[i][j] = new Image();
    }
}
ballImg[0][0].src = "GFX/Ball.png";
ballImg[0][1].src = "GFX/BallSmall.png";
//ballImg[0][2].src = "GFX/BallBig.png";
ballImg[1][0].src = "GFX/BallMega.png";
ballImg[1][1].src = "GFX/BallMegaSmall.png";
//ballImg[1][2].src = "GFX/BallMegaBig.png";
ballImg[2][0].src = "GFX/BallFire.png";
ballImg[2][1].src = "GFX/BallFireSmall.png";
//ballImg[2][2].src = "GFX/BallFireBig.png";

function Ball(x, y, dx, dy, speed, isGripping) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
    this.isGripping = isGripping;
    this.offsetToPaddle = 73 / 2 - player.ballRadius / 2;
    this.isActive = true;
    this.drImage = new DRImage(ballImg[0][0], redrawOverlappingElements);

    this.speedUp = function() {
        this.speed += 0.01;
    }
    this.handleEvents = function() {
        if (!this.isActive) {
            return;
        }
        
        if (!this.isGripping) {
            this.x += this.dx * this.speed;
            this.y += this.dy * this.speed;
        }
        else {
            this.x = inGame.paddle.x + this.offsetToPaddle;
        }
    }

    this.draw = function() {
        this.drImage.draw(this.x, this.y);
    }

    this.updateState = function() {
        this.drImage.clear();
        var ballType = player.isFireBall ? 2 : player.isMegaBall ? 1: 0;
        var ballSize = player.ballRadius === 9 ? 0 : player.ballRadius == 19 ? 2 : 1;
        this.drImage.img = ballImg[ballType][ballSize];
    }

    this.updateState();
}
