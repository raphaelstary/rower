var StartScreen = (function (Event, Key) {
    "use strict";

    function StartScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
    }

    StartScreen.prototype.show = function (next) {
        var width = 256;
        var height = 240;
        var tileWidth = 8;

        var enterListener = this.events.subscribe(Event.KEY_BOARD, function (keyBoard) {
            if (keyBoard[Key.ENTER]) {
                end();
            }
        });
        var aBtnListener = this.events.subscribe(Event.GAME_PAD, function (pad) {
            if (pad.isAPressed()) {
                end();
            }
        });

        var gameName = this.stage.drawText(width / 2, height / 6, 'ROWER', tileWidth * 4, 'Arial', 'darkblue');

        var description = this.stage.drawText(width / 2, height / 3, 'MADE FOR TAGJAM 18', tileWidth * 2, 'Arial');
        var myName = this.stage.drawText(width / 2, height / 3 + tileWidth * 2, 'BY RAPHAEL STARY', tileWidth * 2,
            'Arial');

        var startText = this.stage.drawText(width / 2, height / 4 * 3, "'ENTER' OR 'A' (GAMEPAD)", tileWidth * 2,
            'Arial', 'darkgreen');
        var startTextCont = this.stage.drawText(width / 2, height / 4 * 3 + tileWidth * 2, "TO START", tileWidth * 2,
            'Arial', 'darkgreen');

        var gameControls = this.stage.drawText(width / 2, height / 2, "LEFT PADDLE - 'LEFT' OR 'LB'", tileWidth * 2,
            'Arial', 'darkblue');
        var gameControlsCont = this.stage.drawText(width / 2, height / 2 + tileWidth * 2,
            "RIGHT PADDLE - 'RIGHT' OR 'RB'", tileWidth * 2, 'Arial', 'darkblue');

        var self = this;

        function end() {
            self.stage.remove(gameName);
            self.stage.remove(description);
            self.stage.remove(myName);
            self.stage.remove(startText);
            self.stage.remove(startTextCont);
            self.stage.remove(gameControls);
            self.stage.remove(gameControlsCont);
            self.events.unsubscribe(enterListener);
            self.events.unsubscribe(aBtnListener);
            self.timer.doLater(next, 1);
        }
    };

    return StartScreen;
})(Event, Key);