var lclStorage;
try {
    lclStorage = window.localStorage;
} catch (e) {
    lclStorage = {
        dict: {},
        getItem: function (id) {
            "use strict";
            return this.dict[id];
        },
        setItem: function (id, value) {
            "use strict";
            this.dict[id] = value;
        }
    }
}

var EndScreen = (function (localStorage) {
    "use strict";

    var ALL_TIME_HIGH_SCORE = 'allTimeHighScore';

    function EndScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
        this.timer = services.timer;
    }

    EndScreen.prototype.show = function (next) {
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

        var allTimeHighScore = localStorage.getItem(ALL_TIME_HIGH_SCORE);
        if (allTimeHighScore == null)
            allTimeHighScore = '0';


        var gameOverTxt = this.stage.drawText(width / 2, height / 6, 'GAME OVER', tileWidth * 4, 'Arial', 'darkred');

        var pointsLabel = this.stage.drawText(width / 2, height / 3, 'POINTS', tileWidth * 2, 'Arial');
        var pointsTxt = this.stage.drawText(width / 2, height / 3 + tileWidth * 2, this.sceneStorage.points.toString(),
            tileWidth * 2, 'Arial');

        var startText = this.stage.drawText(width / 2, height / 4 * 3, "'ENTER' OR 'A' (GAMEPAD)", tileWidth * 2,
            'Arial', 'darkgreen');
        var startTextCont = this.stage.drawText(width / 2, height / 4 * 3 + tileWidth * 2, "TO START AGAIN",
            tileWidth * 2, 'Arial', 'darkgreen');

        var bestLabel = this.stage.drawText(width / 2, height / 2, "BEST", tileWidth * 2, 'Arial', 'darkblue');
        var bestTxt = this.stage.drawText(width / 2, height / 2 + tileWidth * 2, allTimeHighScore, tileWidth * 2,
            'Arial', 'darkblue');

        var self = this;

        function end() {
            if (self.sceneStorage.points > parseInt(allTimeHighScore, 10))
                localStorage.setItem(ALL_TIME_HIGH_SCORE, self.sceneStorage.points.toString());

            self.stage.remove(gameOverTxt);
            self.stage.remove(pointsLabel);
            self.stage.remove(pointsTxt);
            self.stage.remove(startText);
            self.stage.remove(startTextCont);
            self.stage.remove(bestLabel);
            self.stage.remove(bestTxt);
            self.events.unsubscribe(enterListener);
            self.events.unsubscribe(aBtnListener);
            self.timer.doLater(next, 1);
        }
    };

    return EndScreen;
})(lclStorage);