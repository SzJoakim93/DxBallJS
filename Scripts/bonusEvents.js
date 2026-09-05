var bonusEvents =
    [
        [ //goods
            function () { //1.1
                inGame.pickup1.play();
                player.isMegaBall = true;
                updateBallsState();
            },
            function () { //1.2
                inGame.pickup1.play();
                for (var i = 0; i < inGame.bricks.length; i++) {
                    if (inGame.bricks[i].textureId === fire_brick && inGame.bricks[i].status === 100) {
                        var leftBrick = inGame.getBrickByCoord(inGame.bricks[i].x - brickWidth, inGame.bricks[i].y);
                        if (leftBrick && (leftBrick.textureId === fire_brick || leftBrick.textureId === -1)) {
                            continue;
                        }

                        var upperLeftBrick = inGame.getBrickByCoord(inGame.bricks[i].x - brickWidth, inGame.bricks[i].y - brickHeight);
                        if (upperLeftBrick && (upperLeftBrick.textureId === fire_brick || upperLeftBrick.textureId === -1)) {
                            continue;
                        }

                        var upBrick = inGame.getBrickByCoord(inGame.bricks[i].x, inGame.bricks[i].y - brickHeight);
                        if (upBrick && (upBrick.textureId === fire_brick || upBrick.textureId === -1)) {
                            continue;
                        }

                        var lowerLeftBrick = inGame.getBrickByCoord(inGame.bricks[i].x - brickWidth, inGame.bricks[i].y + brickHeight);
                        if (lowerLeftBrick && (lowerLeftBrick.textureId === fire_brick || lowerLeftBrick.textureId === -1)) {
                            continue;
                        }
                        inGame.bricks[i].hit();
                    }
                }
            },
            function () { //1.3
                inGame.pickup1.play();
                player.isFireBall = true;
                updateBallsState();
            },
            function () { //1.4
                inGame.pickup1.play();
                player.isShooter = true;
            },
            function () { //1.5
                inGame.pickup1.play();
                player.isGripping = true;
            },
            function () { //1.6
                inGame.pickup1.play();
                for (var i = 0; i < inGame.bricks.length; i++) {
                    if (inGame.bricks[i].textureId === fire_brick && inGame.bricks[i].status > 0) {
                        expandFireBrick(i, 1, 0);
                        expandFireBrick(i, -1, 0);
                        expandFireBrick(i, 0, 1);
                        expandFireBrick(i, 0, -1);
                        expandFireBrick(i, 1, 1);
                        expandFireBrick(i, 1, -1);
                        expandFireBrick(i, -1, -1);
                        expandFireBrick(i, -1, 1);
                    }
                }

                for (var i = 0; i < inGame.bricks.length; i++) {
                    if (inGame.bricks[i].textureId === -1) {
                        inGame.bricks[i].switchToFireBrick();
                    }
                }
            },
            function () { //1.7
                inGame.pickup1.play();
                for (var i = 0; i < inGame.ball.length; i++) {
                    inGame.ball[i].speed = 4;
                }
            },
            function () { //1.8
                inGame.pickup1.play();
                for (var i = 0; i < inGame.bricks.length; i++) {
                    inGame.bricks[i].makeOnceHit();
                }
            }
        ],
        [   //very goods
            function () { //2.1
                inGame.pickup1.play();
                screenChange.change(changeLevel);
            },
            function () { //2.2
                inGame.pickup3.play();
                player.lives++;
                inGame.renderingZones["Lives"].setRenderingNeeded();
            }
        ],
        [   //bads
            function () { //3.1
                inGame.padExplo.play();
                inGame.fallBallCountdown.launch();
            },
            function () { //3.2
                inGame.pickup2.play();
                player.ballRadius = 5;
                updateBallsState();
            },
            function () { //3.3
                inGame.pickup2.play();
                for (var i = 0; i < inGame.ball.length; i++) {
                    inGame.ball[i].speed = MAX_SPEED;
                }
            },
            function () { //3.4
                inGame.shrink.play();
                inGame.paddle.setW(36);
            },
            function () { //3.5
                inGame.pickup2.play();
                player.isFallingBricks = 1;
            }
        ],
        [   //neutrals
            function () { //4.1
                inGame.expand.play();
                inGame.paddle.setW(Math.floor(inGame.paddle.w * 1.5));
            },
            function () { //4.2
                inGame.shrink.play();
                inGame.paddle.setW(Math.floor(inGame.paddle.w / 1.5));
            },
            function () { //4.3
                var ball_count = inGame.ball.length;
                for (var i = 0; i < ball_count; i++) {
                    inGame.ball.push(new Ball(inGame.ball[i].x, inGame.ball[i].y, inGame.ball[i].dx + 0.2, inGame.ball[i].dy - 0.2, inGame.ball[i].speed, false));
                }
                inGame.cloneBall.play();
            }
            /*function() { //4.4
                inGame.expand.play();
                player.ballRadius = 19;
                updateBallsState();
            },
            function() { //4.5
                inGame.ball[0].speed = MAX_SPEED;
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, 0.9, -0.1, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, 0.5, 0.5, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, -0.1, 0.9, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, -0.5, 0.5, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, -0.9, 0.1, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, -0.5, -0.5, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, 0.1, -0.9, MAX_SPEED, false));
                inGame.ball.push(new Ball(inGame.ball[0].x, inGame.ball[0].y, 0.5, -0.5, MAX_SPEED, false));
                inGame.cloneBall.play();
            }*/
        ],
    ]

function expandFireBrick(i, x, y) {
    var brickX = inGame.bricks[i].getRawX();
    var brickY = inGame.bricks[i].getRawY();
    if (brickX + x < 0 || brickX + x >= brickWidth * maxBrickInRow || brickY + y < 0 || brickY + y >= brickHeight * maxBrickInColumn) {
        return;
    }

    var brick = inGame.getBrickByCoord(brickX + x, brickY + y);
    if (brick && brick.textureId === fire_brick) {
        return;
    }
    if (brick) {
        brick.textureId = -1;
    } else {
        inGame.bricks.push(new Brick(inGame.bricks[i].x + (x * brickWidth), inGame.bricks[i].y + (y * brickHeight), -1, 1, true));
    }
}

function updateBallsState() {
    for (var i = 0; i < inGame.ball.length; i++) {
        if (inGame.ball[i].isActive) {
            inGame.ball[i].updateState();
        }
    }
}