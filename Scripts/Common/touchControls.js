var touchPointers = {};
var gameplayTouchPointers = {};

function setTouchKey(button, isPressed) {
    var key = Number(button.dataset.key);
    if (isPressed) {
        processKeyDown(key);
    } else {
        keystates[key] = false;
    }
    button.classList.toggle("is-pressed", isPressed);
}

function releaseTouchPointer(pointerId) {
    var button = touchPointers[pointerId];
    if (button) {
        setTouchKey(button, false);
        delete touchPointers[pointerId];
    }
}

document.querySelectorAll(".touch-button").forEach(function (button) {
    button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        touchPointers[event.pointerId] = button;
        try {
            button.setPointerCapture(event.pointerId);
        } catch (error) {
        }
        setTouchKey(button, true);
    });

    button.addEventListener("pointerup", function (event) {
        event.preventDefault();
        releaseTouchPointer(event.pointerId);
    });

    button.addEventListener("pointercancel", function (event) {
        releaseTouchPointer(event.pointerId);
    });
});

function setupGameplayTouchControls(canvas) {
    document.addEventListener("pointerdown", function (event) {
        if (scene !== inGame || (event.pointerType !== "touch" && event.pointerType !== "pen")) {
            return;
        }

        event.preventDefault();
        gameplayTouchPointers[event.pointerId] = event.clientX;
        try {
            document.documentElement.setPointerCapture(event.pointerId);
        } catch (error) {
        }
    });

    document.addEventListener("pointermove", function (event) {
        if (!Object.prototype.hasOwnProperty.call(gameplayTouchPointers, event.pointerId)) {
            return;
        }

        event.preventDefault();
        var rect = canvas.getBoundingClientRect();
        var previousX = gameplayTouchPointers[event.pointerId];
        gameplayTouchPointers[event.pointerId] = event.clientX;

        if (rect.width > 0) {
            inGame.movePaddleBy((event.clientX - previousX) * canvas.width / rect.width);
        }
    });

    function releaseGameplayPointer(event) {
        delete gameplayTouchPointers[event.pointerId];
    }

    document.addEventListener("pointerup", releaseGameplayPointer);
    document.addEventListener("pointercancel", releaseGameplayPointer);
    document.addEventListener("lostpointercapture", releaseGameplayPointer);
}

window.addEventListener("blur", function () {
    Object.keys(touchPointers).forEach(releaseTouchPointer);
    gameplayTouchPointers = {};
});

if (screen.orientation && screen.orientation.lock) {
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreenElement) {
            screen.orientation.lock("landscape").catch(function () { });
        }
    });
}