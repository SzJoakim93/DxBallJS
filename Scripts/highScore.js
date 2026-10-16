function HighScore() {
    this.titleImg = new Image();
    this.titleImg.src = "GFX/HighScoresTitle.png";
    this.selected = 0;
    this.currentPos = 0;
    this.highScores = [];
    this.virtualKeyboard = new VirtualKeyboard(82, 286, 68, 36);

    this.isEnteringName = function() {
        return this.selected === 0;
    }

    this.updateInputMode = function() {
        this.virtualKeyboard.visible = this.isEnteringName() &&
            (("ontouchstart" in window) || navigator.maxTouchPoints > 0 || isGamePadUsed);
    }

    this.selectPrev = function() {
        this.updateInputMode();
        if (this.virtualKeyboard.visible) {
            this.virtualKeyboard.move(0, -1);
        }
    }

    this.selectNext = function() {
        this.updateInputMode();
        if (this.virtualKeyboard.visible) {
            this.virtualKeyboard.move(0, 1);
        }
    }

    this.selectLeft = function() {
        this.updateInputMode();
        if (this.virtualKeyboard.visible) {
            this.virtualKeyboard.move(-1, 0);
        }
    }

    this.selectRight = function() {
        this.updateInputMode();
        if (this.virtualKeyboard.visible) {
            this.virtualKeyboard.move(1, 0);
        }
    }

    this.back = function() {}

    this.select = function() {
        if (this.selected === 0) {
            this.updateInputMode();
            if (this.virtualKeyboard.visible) {
                this.virtualKeyboard.select(this);
            } else {
                this.finishNameEntry();
            }
        } else {
            scene = mainMenu
        }
    }

    this.finishNameEntry = function() {
        if (this.selected === 0) {
            this.selected = 1;
            this.virtualKeyboard.visible = false;
            saveData("js_ball_high_scores", JSON.stringify(this.highScores));
        }
    }

    this.inputChar = function(c) {
        if (this.selected === 0) {
            if (c === "Backspace") {
                this.highScores[this.currentPos].Name = this.highScores[this.currentPos].Name.slice(0, -1); 
            } else {
                this.highScores[this.currentPos].Name += c;
            }
        }
    }

    this.update = function() {
        this.updateInputMode();
    }

    this.draw = function() {
        ctx.drawImage(this.titleImg, 160, 8);

        drawText(16, 164, white, "Place");
        drawText(70, 164, white, "Name");
        drawText(400, 164, white, "Score");
        drawText(450, 164, white, "Board");

        for (var i = 0; i < this.highScores.length; i++) {
            drawText(16, 184 + (i*20), i === this.currentPos ? gold : white, i+1);
            drawText(70, 184 + (i*20), i === this.currentPos ? gold : white, this.highScores[i].Name);
            drawText(400, 184 + (i*20), i === this.currentPos ? gold : white, this.highScores[i].Score);
            drawText(450, 184 + (i*20), i === this.currentPos ? gold : white, this.highScores[i].Board);
        }

        if (this.virtualKeyboard.visible) {
            ctx.fillStyle = "#000";
            ctx.fillRect(78, 280, 484, 190);
            drawText(82, 278, gold, "Enter your name");
            this.virtualKeyboard.draw();
        }
    }

    this.click = function(e) {
        this.updateInputMode();
        if (!this.virtualKeyboard.visible) {
            return;
        }

        var rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            var x = (e.clientX - rect.left) * canvas.width / rect.width;
            var y = (e.clientY - rect.top) * canvas.height / rect.height;
            this.virtualKeyboard.selectAt(x, y, this);
        }
    }

    this.load = function(isEdit) {
        this.selected = 1;
        this.currentPos = 16;
        this.virtualKeyboard.visible = false;
        this.virtualKeyboard.selectedRow = 0;
        this.virtualKeyboard.selectedCol = 0;
        this.highScores = JSON.parse(loadData("js_ball_high_scores") || "null");
        if (this.highScores === null) {
            this.highScores = [
                { Name: '', Score: 1500, Board: 0 },
                { Name: '', Score: 1400, Board: 0 },
                { Name: '', Score: 1300, Board: 0 },
                { Name: '', Score: 1200, Board: 0 },
                { Name: '', Score: 1100, Board: 0 },
                { Name: '', Score: 1000, Board: 0 },
                { Name: '', Score: 900, Board: 0 },
                { Name: '', Score: 800, Board: 0 },
                { Name: '', Score: 700, Board: 0 },
                { Name: '', Score: 600, Board: 0 },
                { Name: '', Score: 500, Board: 0 },
                { Name: '', Score: 400, Board: 0 },
                { Name: '', Score: 300, Board: 0 },
                { Name: '', Score: 200, Board: 0 },
                { Name: '', Score: 100, Board: 0 }
            ]
        }

        if (isEdit) {
            this.calculatePos();
        }
    }

    this.calculatePos = function() {
        for (var i = 0; i < this.highScores.length; i++) {
            if (inGame.Score > this.highScores[i].Score) {
                this.highScores.splice(i, 0, { Name: "", Score: inGame.Score, Board: inGame.levelNum});
                this.highScores.length -= 1;
                this.currentPos = i;
                this.selected = 0;
                return;
            }
        }
    }

    //for test
    inGame.Score = 1200;
    this.load(true);
}