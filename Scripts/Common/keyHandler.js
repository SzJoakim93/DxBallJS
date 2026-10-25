var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (scene.IsInputActive && scene.IsInputActive()) {
    if (e.which === KEY_BACKSPACE) {
      e.preventDefault();
      scene.inputChar("Backspace");
      return;
    } else if (e.which === KEY_SPACE) {
      e.preventDefault();
      scene.inputChar(" ");
      return;
    } else if (e.key && e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      scene.inputChar(e.key.toUpperCase());
      return;
    } else if (e.which === KEY_RETURN) {
      e.preventDefault();
      scene.finishInput();
      return;
    }
  }

  processKeyDown(e.which);
}

function processKeyDown(keyCode) {
  keystates[keyCode] = true;

  if (virtualKeyboard.visible) {
    if (keyCode === KEY_UP) {
      virtualKeyboard.move(0, -1);
    } else if (keyCode === KEY_DOWN) {
      virtualKeyboard.move(0, 1);
    } else if (keyCode === KEY_LEFT) {
      virtualKeyboard.move(-1, 0);
    } else if (keyCode === KEY_RIGHT) {
      virtualKeyboard.move(1, 0);
    } else if (keyCode === KEY_RETURN) {
      virtualKeyboard.select();
    }

    return;
  }

  if (keyCode === KEY_RETURN && scene.select) {
    scene.select();
  } else if (keyCode === KEY_UP && scene.selectPrev) {
    scene.selectPrev();
  } else if (keyCode === KEY_DOWN && scene.selectNext) {
    scene.selectNext();
  } else if (keyCode === KEY_LEFT && scene.selectLeft) {
    scene.selectLeft();
  } else if (keyCode === KEY_RIGHT && scene.selectRight) {
    scene.selectRight();
  } else if (keyCode === KEY_ESCAPE && scene.back) {
    scene.back();
  }
}

function keyUpHandler(e) {
  keystates[e.which] = false;
}