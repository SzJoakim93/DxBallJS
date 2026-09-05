var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  keystates[e.which] = true;
  
  if (e.which === KEY_RETURN) {
    scene.select();
  } else if (e.which === KEY_UP) {
    scene.selectPrev();
  } else if (e.which === KEY_DOWN) {
    scene.selectNext();
  } else if (e.which === KEY_ESCAPE) {
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
