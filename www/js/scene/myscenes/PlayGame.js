var PlayGame = (function () {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.events = services.events;
    }

    PlayGame.prototype.show = function (next) {
        this.stage.drawRectangle(50, 50, 50, 50, '#000', true);
    };

    return PlayGame;
})();