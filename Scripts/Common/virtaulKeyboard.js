var KEY_LAYOUT = [
    ["A","B","C","D","E","F","G"],
    ["H","I","J","K","L","M","N"],
    ["O","P","Q","R","S","T","U"],
    ["V","W","X","Y","Z"],
    ["SPACE","BACK","OK"]
];

function VirtualKeyboard(x, y, keyWidth, keyHeight) {
    this.x = x;
    this.y = y;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;

    this.selectedRow = 0;
    this.selectedCol = 0;

    this.visible = false;

    this.getKey = function() {
        return KEY_LAYOUT[this.selectedRow][this.selectedCol];
    }

    this.draw = function() {
        if (!this.visible){
            return;
        }

        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (var i = 0; i < KEY_LAYOUT.length; i++) {
            for (var j = 0; j < KEY_LAYOUT[i].length; j++) {
                var x = this.x + j * this.keyWidth;
                var y = this.y + i * this.keyHeight;

                // Highlight selected
                if (i === this.selectedRow && j === this.selectedCol) {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x, y, this.keyWidth - 4, this.keyHeight - 4);
                    ctx.fillStyle = "#000";
                } else {
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(x, y, this.keyWidth - 4, this.keyHeight - 4);
                    ctx.fillStyle = "#fff";
                }

                ctx.fillText(KEY_LAYOUT[i][j], x + this.keyWidth/2, y + this.keyHeight/2);
            }
        }
    }

    this.move = function(dx, dy) {
        this.selectedRow = Math.max(0, Math.min(KEY_LAYOUT.length - 1, this.selectedRow + dy));

        var rowLength = KEY_LAYOUT[this.selectedRow].length;
        this.selectedCol = Math.max(0, Math.min(rowLength - 1, this.selectedCol + dx));
    }

    this.select = function(scene) {
        var key = this.getKey();

        if (key === "BACK") {
            scene.inputChar("Backspace");
        } else if (key === "SPACE") {
            scene.inputChar(" ");
        } else if (key === "OK") {
            this.visible = false;
        } else {
            scene.inputChar(key);
        }
    }
}