var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = 640;
canvas.height = 480;

var white = "#FFFFFF";
var gold = "#E4C42C";
var green = "#00AA00";

var font = new Font("GFX/Font.png", 6, 6, 32, 31);

var mainMenu = new MainMenu();
var inGame = new InGame();
var highScore = new HighScore();

var bonuses = [];

//var music = new Sound("Music/BeatWave.mp3");

var scene = mainMenu;

var particleManager = new ParticleManager();
var explosion = new Explosion();

function sizeCanvas() {
    var scaleX = (innerWidth - 20) / canvas.width;
    var scaleY = (innerHeight - 20) / canvas.height;

    var scaleToFit = Math.min(scaleX, scaleY);

    myCanvas.style.transformOrigin = "50% 0 0"; //scale from top left
    myCanvas.style.transform = "translateX(" + (innerWidth / 2 - canvas.width / 2).toString() + "px) scale(" + scaleToFit.toString() + ")";
}

sizeCanvas();
addEventListener("resize", sizeCanvas);

main();

function main() {
    if (screenChange.isChanging) {
        screenChange.changing();
    } else {
        scene.update();
        gamepadButtonDownHandler();
        scene.draw();
        particleManager.apply();
        explosion.applyExplosions();
    }
    _requestAnimationFrame(main);
}

function drawText(x, y, color, text) {
    ctx.font = "15px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text.toString(), x, y);
}

function _requestAnimationFrame(draw) {
    if (requestAnimationFrame) {
        requestAnimationFrame(draw);
    } else if (webkitRequestAnimationFrame) {
        webkitRequestAnimationFrame(draw);
    } else if (mozRequestAnimationFrame) {
        mozRequestAnimationFrame(draw);
    } else if (msRequestAnimationFrame) {
        msRequestAnimationFrame(draw);
    }
}
