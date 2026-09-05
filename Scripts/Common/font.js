var ALIGN_LEFT = 0;
var ALIGN_CENTER = 1;
var ALIGN_RIGHT = 2;

function Font(img, clipCountX, clipCountY, clipWidth, clipHeight) {
    this.fontImage = new MultipleImage(img, clipCountX, clipCountY, clipWidth, clipHeight);

    this.apply = function(word, x, y, align) {
        switch (align) {
            case ALIGN_LEFT:
                break;
            case ALIGN_CENTER:
                x -= word.length * clipWidth / 2;
                break;
            case ALIGN_RIGHT:
                x -= word.length * clipWidth;
                break;
        }
        for (var i = 0; i < word.length; i++) {
            var charCdoe = word.charCodeAt(i);
            if (charCdoe < 48 || charCdoe > 57 && charCdoe < 65 || charCdoe > 90) {
                continue;
            }
            var fontIndex = word.charCodeAt(i) < 58 ? word.charCodeAt(i) - 48 : word.charCodeAt(i) - 55;
            this.fontImage.apply(x + i*clipWidth, y, fontIndex);
        }
    }
}