function MainMenu() {
    this.menuScreen = new Image()
    this.menuScreen.src = "GFX/Mainmenu.png";
    this.menuScreen.onload = function () {
        ctx.drawImage(mainMenu.menuScreen, 0, 0);
    };
    this.mainTitleAnim = new Animation("GFX/MainTitle.png", 1, 6, 427, 85, 10);
    this.mainTitle = new Animator(this.mainTitleAnim, 103, 28, null, null);
    this.ballAnim = new Animation("GFX/Sphere.png", 14, 1, 135, 135, 100);
    this.ball = new Animator(this.ballAnim, 500, 318, null, null);
    this.focus = new Image();
    this.focus.src = "GFX/Focus.png";

    this.selected = 0;

    this.selectPrev = function () {
        this.selected--;
        if (this.selected < 0) {
            this.selected = 2;
        }
    }

    this.selectNext = function () {
        this.selected++;
        if (this.selected > 2) {
            this.selected = 0;
        }
    }

    this.select = function () {
        switch (this.selected) {
            case 0:
                screenChange.change(function () {
                    inGame.switch();
                    inGame.newGame();
                });
                break;
            case 1:
                screenChange.change(function () {
                    inGame.switch();
                    inGame.load();
                });
                break;
            case 2:
                window.close();
                break;
        }
    }

    this.back = function () {

    }

    this.switch = function () {
        document.documentElement.classList.remove("in-game");
        document.body.classList.remove("in-game");
        scene = this;
        ctx.drawImage(this.menuScreen, 0, 0);
    }

    this.update = function () {

    }

    this.draw = function () {
        this.ball.applyAnim();
        this.mainTitle.applyAnim();
        ctx.fillRect(100, 120, 400, 145);
        ctx.drawImage(this.focus, 320 - 150, 120 + this.selected * 40);
        font.apply("NEW GAME", 320, 138, ALIGN_CENTER);
        font.apply("CONTINUE", 320, 178, ALIGN_CENTER);
        font.apply("EXIT", 320, 218, ALIGN_CENTER);
    }
}