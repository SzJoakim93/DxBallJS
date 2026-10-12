var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  processKeyDown(e.which);
}

function processKeyDown(keyCode) {
  keystates[keyCode] = true;

  if (keyCode === KEY_RETURN && scene.select) {
    scene.select();
  } else if (keyCode === KEY_UP && scene.selectPrev) {
    scene.selectPrev();
  } else if (keyCode === KEY_DOWN && scene.selectNext) {
    scene.selectNext();
  } else if (keyCode === KEY_ESCAPE && scene.back) {
    scene.back();
  }
}

function keyUpHandler(e) {
  keystates[e.which] = false;
}

function clickHandler(e) {
  if (scene.click) {
    scene.click(e);
  }
}

function mouseMoveHandler(e) {
  if (scene.mouseMove) {
    scene.mouseMove(e);
  }
}
