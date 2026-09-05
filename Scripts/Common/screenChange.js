var screenChange = {
    isChanging: false,
    coords: 0,
    change: function(callBackfunc) {
        screenChange.isChanging = true;
        screenChange.coords = 0;
        screenChange.callBackfunc = callBackfunc;
        ctx.fillStyle = "black";
    },
    changing: function() {
        if (!screenChange.isChanging) {
            return;
        }
        screenChange.coords += 5;
        ctx.fillRect(0, 0, canvas.width, screenChange.coords);
        if (screenChange.coords > canvas.height) {
            screenChange.isChanging = false;
            screenChange.callBackfunc();
        }
    }
}