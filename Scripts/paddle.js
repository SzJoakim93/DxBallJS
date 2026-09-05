var paddleHeight = 15;

function Paddle() {
    this.isGripping = false;

    this.w = 73;
    this.x = (canvas.width - this.w) / 2;
    this.y = canvas.height - 30;

    this.paddleAnim = new Animation("GFX/Paddle.png", 1, 4, 73, 15, 10);
    this.paddle = new Animator(this.paddleAnim, (canvas.width - this.w) / 2, canvas.height - paddleHeight - 6, this.w, paddleHeight);

    this.paddleWithGripAnim = new Animation("GFX/PaddleGrip.png", 1, 4, 73, 26, 10);
    this.paddleWithGrip = new Animator(this.paddleWithGripAnim, (canvas.width - this.w) / 2, canvas.height - paddleHeight - 16, this.w, paddleHeight + 11);

    this.paddleWithShooterAnim = new Animation("GFX/PaddleShooter.png", 1, 4, 73, 30, 10);
    this.paddleWithShooter = new Animator(this.paddleWithShooterAnim, (canvas.width - this.w) / 2, canvas.height - paddleHeight - 21, this.w, paddleHeight + 15);

    this.electricAnim = new Animation("GFX/PaddleThunder.png", 1, 4, 66, 12, 40);
    this.electric = new Animator(this.electricAnim, this.paddle.x + 10, this.paddle.y - 14, this.w - 5, 12);

    this.moveLeft = function (delta) {
        this.x = this.paddle.x = this.paddleWithGrip.x = this.paddleWithShooter.x = Math.max(this.paddle.x - delta, 19);
        this.electric.x = this.paddle.x + 2;
    }

    this.moveRight = function (delta) {
        this.x = this.paddle.x = this.paddleWithGrip.x = this.paddleWithShooter.x = Math.min(this.paddle.x + delta, canvas.width - this.w - 20);
        this.electric.x = this.paddle.x + 2;
    }

    this.setX = function (x) {
        this.x = this.paddle.x = this.paddleWithGrip.x = this.paddleWithShooter.x = x;
        this.electric.x = this.paddle.x + 2;
    }

    this.setW = function (w) {
        this.w = this.paddle.w = this.paddleWithGrip.w = this.paddleWithShooter.w = w;
        this.electric.w = this.paddle.w - 5;
    }

    this.setGripping = function (isGripping) {
        this.isGripping = isGripping;
    }

    this.update = function () {

    }

    this.draw = function () {
        if (player.isShooter) {
            this.paddleWithShooter.applyAnim();
        } else if (player.isGripping || this.isGripping) {
            this.paddleWithGrip.applyAnim();
        } else {
            this.paddle.applyAnim();
        }

        if (this.isGripping) {
            this.electric.applyAnim();
        }
    }

    this.clear = function () {
        if (player.isShooter) {
            this.paddleWithShooter.clear();
        } else if (player.isGripping || this.isGripping) {
            this.paddleWithGrip.clear();
        } else {
            this.paddle.clear();
        }

        this.electric.clear();
    }
}