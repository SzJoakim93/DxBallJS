var level =
{
    brickImg: [],
    background: new Image(),
    load: function (id) {
        bricksRemaining = 0;
        inGame.bricks.length = 0;
        inGame.isBgRenderingNeeded = true;
        var bricks = levelData[id]();

        for (var i = 0; i < 27; i++) {
            if (i > 17 && i < 20 || i > 21 && i < 25) {
                this.brickImg[i] = null;
                continue;
            }
            this.brickImg[i] = new Image();
            this.brickImg[i].src = "GFX/Brick" + (i + 1).toString() + ".png";
        }

        for (var i = 0; i < bricks.length; i++) {
            var life, destroyable;
            if (bricks[i].textureId === little_strong_brick
                || bricks[i].textureId === undestroyable_brick_hitable
                || bricks[i].textureId === invisible_brick) {
                life = 2;
            } else if (bricks[i].textureId === strong_brick) {
                life = 3;
            } else {
                life = 1;
            }

            if (bricks[i].textureId === undestroyable_brick || bricks[i].textureId === undestroyable_brick_hitable) {
                destroyable = false;
            } else {
                destroyable = true;
            }

            inGame.bricks[i] = new Brick(
                brickOffsetLeft + bricks[i].x * brickWidth,
                brickOffsetTop + bricks[i].y * brickHeight,
                bricks[i].textureId,
                life,
                destroyable);
        }
    }
}