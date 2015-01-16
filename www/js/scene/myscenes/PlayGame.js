var PlayGame = (function (window, Event, Math, Key) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.events = services.events;
    }

    PlayGame.prototype.show = function (next) {
        var startX = 300;
        var startY = 500;

        var rect = this.stage.drawRectangle(startX, startY, 50, 25, '#000');
        rect.rotation = -Math.PI / 2;
        var circ = this.stage.drawCircle(rect.x, rect.y, 50, '#000');
        var line = this.stage.drawLine(rect.x, rect.y, circ.data.radius, '#000');
        line.anchorOffsetX = line.getWidthHalf();
        line.rotation = rect.rotation;

        var rowBoat = {
            forceX: 0,
            forceY: 0,
            drawable: rect
        };

        function paddleOnPortSide() { // backbord
            paddle(-30);
        }

        function paddleOnBowSide() { // star board - steuerbord
            paddle(30);
        }

        function paddle(degrees) {
            var angle = rect.rotation + toRadians(degrees);
            var magnitude = 10;
            rowBoat.forceX += magnitude * Math.cos(angle);
            rowBoat.forceY += magnitude * Math.sin(angle);
            rowBoat.drawable.rotation = angle;
        }

        function toRadians(degrees) {
            return degrees * Math.PI / 180;
        }

        // global test methods
        window.paddleOnPortSide = paddleOnPortSide;
        window.paddleOnBowSide = paddleOnBowSide;

        var leftPressed = false;
        var rightPressed = false;
        this.events.subscribe(Event.KEY_BOARD, function (keyBoard) {
            if (!leftPressed && keyBoard[Key.LEFT]) {
                leftPressed = true;
                paddleOnPortSide();
            } else if (leftPressed && !keyBoard[Key.LEFT]) {
                leftPressed = false;
            }
            if (!rightPressed && keyBoard[Key.RIGHT]) {
                rightPressed = true;
                paddleOnBowSide();
            } else if (rightPressed && !keyBoard[Key.RIGHT]) {
                rightPressed = false;
            }
        });

        var leftBumper = false;
        var rightBumper = false;
        this.events.subscribe(Event.GAME_PAD, function (gamePad) {
            if (!leftBumper && gamePad.isLeftBumperPressed()) {
                leftBumper = true;
                paddleOnPortSide();
            } else if (leftBumper && !gamePad.isLeftBumperPressed()) {
                leftBumper = false;
            }
            if (!rightBumper && gamePad.isRightBumperPressed()) {
                rightBumper = true;
                paddleOnBowSide();
            } else if (rightBumper && !gamePad.isRightBumperPressed()) {
                rightBumper = false;
            }
        });

        this.events.subscribe(Event.TICK_MOVE, function () {
            var forceX = 0;
            var forceY = 0;

            // current - river upstream
            forceY += 2;

            var waterResistance = 0.9;
            rowBoat.forceX *= waterResistance;
            rowBoat.forceY *= waterResistance;

            //rowBoat.drawable.rotation = Math.atan2(rowBoat.forceX, rowBoat.forceY);

            forceX += rowBoat.forceX;
            forceY += rowBoat.forceY;

            rowBoat.drawable.x += forceX;
            rowBoat.drawable.y += forceY;

            // sync drawables
            circ.x = rect.x;
            circ.y = rect.y;
            line.x = rect.x;
            line.y = rect.y;
            line.rotation = rect.rotation;
        });

        function forceStuff() {
        }

    };

    return PlayGame;
})(window, Event, Math, Key);