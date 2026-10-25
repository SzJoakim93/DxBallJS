function HighScore() {
    this.titleImg = new Image();
    this.titleImg.src = "GFX/HighScoresTitle.png";
    this.selected = 0;
    this.currentPos = 0;
    this.highScores = [];

    this.isEnteringInput = function() {
        return this.selected === 0;
    }

    this.select = function() {
        mainMenu.switch();
    }

    this.finishInput = function() {
        if (this.selected === 0) {
            this.selected = 1;
            virtualKeyboard.setVisibility(false);
            virtualKeyboard.clear();
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
    }

    this.switch = function() {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.drawImage(this.titleImg, 160, 8);
        scene = this;
        if (this.selected === 0) {
            virtualKeyboard.setVisibility(true);
        }
    }

    this.draw = function() {
        ctx.fillStyle = "#000";
        ctx.fillRect(16, 160, 480, 400);

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

        if (virtualKeyboard.visible) {
            ctx.fillStyle = "#000";
            ctx.fillRect(78, 280, 484, 190);
            drawText(82, 278, gold, "Enter your name: " + this.highScores[this.currentPos].Name);
        }
    }

    this.load = function(isEdit) {
        this.selected = 1;
        this.currentPos = 16;
        virtualKeyboard.setVisibility(false);
        virtualKeyboard.selectedRow = 0;
        virtualKeyboard.selectedCol = 0;
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