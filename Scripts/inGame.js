function InGame() {
    this.ammoImg = new Image();
    this.borderLeftImg = new Image();
    this.borderRightImg = new Image();
    this.gameOverTitle = new Image();
    this.paddleLifeImg = new Image();

    this.ammoImg.src = "GFX/Ammo.png";
    this.borderLeftImg.src = "GFX/BorderLeft.png";
    this.borderRightImg.src = "GFX/BorderRight.png";
    this.paddleLifeImg.src = "GFX/PaddleLife.png";

    this.thunderAnimation = new Animation("GFX/Thunder.png", 3, 1, 200, 400, 40, function(obj) {
        obj.thunder.x = -1;
        obj.thunder.clear();
    });
    this.thunder = new Animator(this.thunderAnimation, -1, -1, 200, 400, redrawOverlappingElements, this);
    this.thunderTimeout = new TimeoutEvent(2000, function(obj) { obj.launchThunder(); }, this, true);

    this.bonuses = [];
    this.ammos = [];
    this.bonusDropCounter = getBonusDropCounter();
    this.bonusCoolDown = 0;

    this.paddle = new Paddle();
    this.ball = [new Ball(canvas.width / 2, canvas.height - 30, 0.25, -0.75, 4, true)];

    this.boingSnd = new Sound("SFX/Boing.mp3");
    this.hitBrickSnd = new Sound("SFX/Wowpulse.mp3");
    this.hitBrickSnd2 = new Sound("SFX/Effect.mp3");
    this.hitBrickSnd3 = new Sound("SFX/Ao-laser.mp3");
    this.hitBrickSnd4 = new Sound("SFX/Glass.mp3");
    this.hitWallSnd = new Sound("SFX/Bassdrum.mp3");
    this.padExplo = new Sound("SFX/Padexplo.mp3");
    this.fire = new Sound("SFX/Xplosht1.mp3");
    this.pickup1 = new Sound("SFX/Saucer.mp3");
    this.pickup2 = new Sound("SFX/Orchestr.mp3");
    this.pickup3 = new Sound("SFX/Fanfare.mp3");
    this.shrink = new Sound("SFX/Sweepdow.mp3");
    this.expand = new Sound("SFX/Effect2.mp3");
    this.cloneBall = new Sound("SFX/Peow!.mp3");
    this.bankSnd = new Sound("SFX/Bang.mp3");
    this.ammoSnd = new Sound("SFX/Gunfire.mp3");
    this.fallDownBrickSnd = new Sound("SFX/Orchblas.mp3");
    this.fallDownBallSnd = new Sound("SFX/Byeball.mp3");
    this.voltageSnd = new Sound("SFX/Voltage.mp3");
    this.thunderSnd = new Sound("SFX/Thudclap.mp3");

    this.musicPaths = ["BeatWave", "Orbflowr", "Raiders", "Seasons"];

    this.fallBallCountdown = new TimeoutEvent(100, fallDownBall, null);
    this.changeLevelEvent = new TimeoutEvent(100, changeLevel, null);

    this.bricks = [];

    this.groupNum = 0;
    this.levelNum = 0;

    this.prevMouseX = null;
    this.prevMouseY = null;

    this.renderingZones = {};
    this.renderingZones["Score"] = new RenderingZone(20, 4, 400, 32, function (x, y) { font.apply(player.score.toString(), x, y, ALIGN_LEFT); });
    this.renderingZones["Lives"] = new RenderingZone(canvas.width / 2, 20, canvas.width / 2 - 64, 5, function (obj, x, y) {
        for (var i = 0; i < player.lives - 1; i++) {
            ctx.drawImage(obj.paddleLifeImg, canvas.width - 64 - (i * 20), y);
        }
    }, this);
    this.renderingZones["LeftBorder"] = new RenderingZone(0, 0, 19, 478, function (obj, x, y) { ctx.drawImage(obj.borderLeftImg, x, y); }, this);
    this.renderingZones["RightBorder"] = new RenderingZone(canvas.width - 20, 0, 19, 478, function (obj, x, y) { ctx.drawImage(obj.borderRightImg, x, y); }, this);

    this.selectPrev = function () { }
    this.selectNext = function () { }
    this.select = function () { }

    this.back = function () {
        if (document.pointerLockElement === canvas) {
            document.exitPointerLock();
        }
        document.documentElement.classList.remove("in-game");
        document.body.classList.remove("in-game");
        scene = mainMenu;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.switch = function () {
        document.documentElement.classList.add("in-game");
        document.body.classList.add("in-game");
        scene = this;
        this.redrawMap();
    }

    this.frameCount = 0;

    this.update = function () {
        var isGripping = false;
        for (var i = 0; i < this.ball.length; i++) {
            if (this.ball[i].isGripping) {
                isGripping = true;
            }
            this.ball[i].handleEvents();
            this.collisionDetection(i);
        }
        this.paddle.setGripping(isGripping);
        this.paddle.update();

        if (!this.fallBallCountdown.isLaunched()) {
            if (keystates[KEY_LEFT] || isActionPressed("left", false)) {
                this.paddle.moveLeft(4);
            }
            if (keystates[KEY_RIGHT] ||isActionPressed("right", false)) {
                this.paddle.moveRight(4);
            }
            if (keystates[KEY_SPACE] || isActionPressed("a", true)) {
                this.launchBall();
                this.shoot();
            }

            //use it for debug
            if (keystates[KEY_R]) {
                bonusEvents[2][4]();
                //this.thunderTimeout.launch();
            }
        }

        for (var i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].update();
        }

        for (var i = 0; i < this.ammos.length; i++) {
            this.ammos[i].y -= 6;

            for (var j = 0; j < this.bricks.length; j++) {
                if (this.bricks[j].collisionByAmmo(i)) {
                    break;
                }
            }

            if (this.ammos[i] && this.ammos[i].y < 0) {
                this.ammos[i].drImg.clear();
                this.ammos.splice(i, 1);
            }
        }

        if (bricksRemaining <= 0) {
            screenChange.change(changeLevel);
        }

        this.fallBallCountdown.handleEvent();
        this.changeLevelEvent.handleEvent();

        for (var i = 0; i < this.ball.length; i++) {
            if (player.isFireBall && this.frameCount % 10 === 0) {
                particleManager.addParticle(this.ball[i].x + player.ballRadius / 2, this.ball[i].y + player.ballRadius / 2, 2, 30, false);
            }

            if (!this.ball[i].isActive) {
                this.ball[i].drImage.clear();
                this.ball.splice(i, 1);
            }
        }

        if (this.ball.length === 0 && !this.fallBallCountdown.isLaunched()) {
            this.padExplo.play();
            particleManager.addParticle(this.paddle.x + this.paddle.w / 2, this.paddle.y, 6, 60, true);
            this.fallBallCountdown.launch();
        }

        this.thunderTimeout.handleEvent();
        if (this.thunderTimeout.isLaunched() && this.thunderTimeout.currentTime < 1000) {
            this.voltageSnd.play();
        }

        this.frameCount++;
        if (this.bonusCoolDown > 0) {
            this.bonusCoolDown--;
        }
    }

    this.draw = function () {        
        if (this.thunder.x > -1) {
            this.thunder.applyAnim();
        }

        this.paddle.draw();
        this.drawBricks();

        this.renderingZones["Score"].rendering();
        this.renderingZones["Lives"].rendering();
        this.renderingZones["LeftBorder"].rendering();
        this.renderingZones["RightBorder"].rendering();

        for (var i = 0; i < this.ball.length; i++) {
            this.ball[i].draw();
        }

        for (var i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].draw();
        }

        for (var i = 0; i < this.ammos.length; i++) {
            this.ammos[i].drImg.draw(this.ammos[i].x, this.ammos[i].y);
        }

        if (player.lives === 1 && this.fallBallCountdown.isLaunched()) {
            font.apply("GAME OVER", canvas.width / 2, canvas.height / 2, ALIGN_CENTER);
        }
    }

    this.collisionDetection = function (i) {
        if (!this.ball[i].isActive) {
            return;
        }
        if (this.ball[i].x + this.ball[i].dx > canvas.width - player.ballRadius - 20 && this.ball[i].dx > 0 || this.ball[i].x + this.ball[i].dx < 20 && this.ball[i].dx < 0) {
            this.ball[i].dx = -this.ball[i].dx;
            this.hitWallSnd.play();
            this.ball[i].speedUp();
        }

        if (this.ball[i].y + this.ball[i].dy < player.ballRadius) {
            this.ball[i].dy = -this.ball[i].dy;
            this.hitWallSnd.play();
            this.ball[i].speedUp();
        } else if (this.ball[i].y + this.ball[i].dy > canvas.height - player.ballRadius - paddleHeight - 6 && !this.ball[i].isGripping) {
            if (this.ball[i].x + player.ballRadius > this.paddle.x && this.ball[i].x < this.paddle.x + this.paddle.w) {
                this.ball[i].dx = ((this.ball[i].x - this.paddle.x) / this.paddle.w - 0.5) * 1.5;
                this.ball[i].dy = -1 + Math.abs(this.ball[i].dx);

                if (player.isFallingBricks) {
                    this.fallDownBricks();
                }

                if (player.isGripping) {
                    this.ball[i].offsetToPaddle = this.ball[i].x - this.paddle.x;
                    this.ball[i].isGripping = true;
                } else {
                    this.boingSnd.play();
                    this.ball[i].speedUp();
                }
            } else {
                this.ball[i].isActive = false;
                this.fallDownBallSnd.play();
            }
        }

        for (var j = 0; j < this.bricks.length; j++) {
            this.bricks[j].collision(i);
        }
    }

    this.fallDownBricks = function () {
        this.fallDownBrickSnd.play();
        for (var i = 0; i < maxBrickInRow; i++) {
            var prevBrick = null;
            for (var j = maxBrickInColumn - 1; j >= 0; j--) {
                var brick = this.getBrickByCoord(i * brickWidth + brickOffsetLeft, j * brickHeight + brickOffsetTop);
                if (brick) {
                    if (j !== maxBrickInColumn - 1 && (!prevBrick || prevBrick.y !== brick.y + brickHeight)) {
                        brick.fallDown();
                    }
                    prevBrick = brick;
                }
            }
        }

        this.redrawMap();
    }

    this.launchThunder = function() {
        for (var i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].status === 100) {
                this.thunder.reset();
                this.thunder.x = this.bricks[i].x - 100 + (brickWidth / 2);
                this.thunder.y = this.bricks[i].y - 400 + (brickHeight / 2);
                this.bricks[i].destroy();
                this.thunderSnd.play();
                break;
            }
        }
    }

    this.newGame = function () {
        this.levelNum = 0;
        this.resetGameState();
        player.score = 0;
        player.lives = 3;
        level.load(inGame.levelNum);
        this.renderingZones["Score"].setRenderingNeeded();
        this.renderingZones["Lives"].setRenderingNeeded();
        //loadMusic();
    }

    this.resetGameState = function () {
        this.ball.length = 1;
        player.ballRadius = 9;
        this.ball[0] = new Ball(canvas.width / 2, canvas.height - 30, 0.25, -0.75, 4, true);
        this.paddle.setX((canvas.width - this.paddle.w) / 2);
        this.paddle.setW(73);
        player.isGripping = false;
        player.isShooter = false;
        player.isMegaBall = false;
        player.isFireBall = false;
        player.isFallingBricks = false;
        this.bonuses.length = 0;
        this.bonusDropCounter = getBonusDropCounter();
        this.bonusCoolDown = 0;
        updateBallsState();
        this.ammos.length = 0;
        this.redrawMap();
    }

    this.getBrickByCoord = function (x, y) {
        for (var i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].status > 0 && this.bricks[i].x === x && this.bricks[i].y === y) {
                return this.bricks[i];
            }
        }

        return null;
    }

    this.drawBricks = function () {
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw();
        }
    }

    this.movePaddleBy = function (delta) {
        if (this.fallBallCountdown.isLaunched()) {
            return;
        }

        if (delta > 0) {
            this.paddle.moveRight(delta);
        } else if (delta < 0) {
            this.paddle.moveLeft(-delta);
        }
    }

    this.mouseMove = function (e) {
        if (this.fallBallCountdown.isLaunched()) {
            return;
        }

        var mouseDelta;
        if (document.pointerLockElement === canvas) {
            mouseDelta = e.movementX;
        } else if (this.prevMouseX != null) {
            mouseDelta = e.clientX - this.prevMouseX;
        }

        if (mouseDelta != null) {
            this.movePaddleBy(mouseDelta);
        }

        this.prevMouseX = e.clientX;
    }

    this.click = function (e) {
        if (e.pointerType !== "touch" && canvas.requestPointerLock && document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }
        this.launchBall();
        this.shoot();
    }

    this.launchBall = function () {
        for (var i = 0; i < this.ball.length; i++) {
            this.ball[i].isGripping = false;
        }
        this.paddle.clear();
        this.paddle.setGripping(false);
    }


    this.redrawMap = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].isDrawNeeded = true;
            if (this.bricks[i].fireAnim) {
                this.bricks[i].fireAnim.applyPrevCoords();
            }
        }

        this.renderingZones["Score"].setRenderingNeeded();
        this.renderingZones["Lives"].setRenderingNeeded();
        this.renderingZones["LeftBorder"].setRenderingNeeded();
        this.renderingZones["RightBorder"].setRenderingNeeded();
    }

    this.redrawRenderingZones = function (x, y, w, h) {
        inGame.renderingZones["Score"].setRenderingOnEnter(x, y, w, h);
        inGame.renderingZones["Lives"].setRenderingOnEnter(x, y, w, h);
        inGame.renderingZones["LeftBorder"].setRenderingOnEnter(x, y, w, h);
        inGame.renderingZones["RightBorder"].setRenderingOnEnter(x, y, w, h);
    }

    this.shoot = function () {
        if (player.isShooter) {
            this.ammos.push({ drImg: new DRImage(this.ammoImg), x: this.paddle.x, y: this.paddle.y });
            this.ammos.push({ drImg: new DRImage(this.ammoImg), x: this.paddle.x + this.paddle.w, y: this.paddle.y });
            this.ammoSnd.play();
        }
    }

    this.save = function () {
        var gameState = { BoardSet: inGame.groupNum, Board: inGame.levelNum, Score: inGame.Score, Lives: player.lives };
        saveData("js_ball_game_state", JSON.stringify(gameState));
    }

    this.load = function () {
        var gameStateStr = loadData("js_ball_game_state");
        var gameState = JSON.parse(gameStateStr || "null");
        if (gameState === null) {
            //inGame.groupNum = 1;
            inGame.levelNum = 0;
            player.score = 0;
            player.lives = 3;
        } else {
            //inGame.groupNum = gameState.BoardSet;
            inGame.levelNum = gameState.Board;
            player.score = gameState.Score;
            player.lives = gameState.Lives;
        }

        this.renderingZones["Score"].setRenderingNeeded();
        this.renderingZones["Lives"].setRenderingNeeded();

        level.load(inGame.levelNum);
        this.resetGameState();
        this.redrawMap();
    }
}

function changeLevel() {
    inGame.levelNum++;
    inGame.save();
    level.load(inGame.levelNum);
    inGame.resetGameState();
    inGame.thunderTimeout.reset();
    explosion.explosions.length = 0;
    //loadMusic();
}

function fallDownBall() {
    player.lives--;
    inGame.isDrawLivesNeeded = true;
    if (player.lives === 0) {
        document.documentElement.classList.remove("in-game");
        document.body.classList.remove("in-game");
        highScore.load(true);
        scene = highScore;
    } else {
        inGame.resetGameState();
    }
}

function loadMusic() {
    if (inGame.music) {
        inGame.music.stop();
    }
    inGame.music = new Sound("Music/" + inGame.musicPaths[Math.floor(Math.random() * inGame.musicPaths.length)] + ".mp3");
    inGame.music.play();
}

function getBonusDropCounter() {
    return Math.floor(Math.random() * 5) + 1;
}


function redrawOverlappingElements(x, y, w, h) {
    if (!inGame) {
        return;
    }
    redrawBricksOnOverlapping(x, y, w, h);
    inGame.redrawRenderingZones(x, y, w, h);
}
