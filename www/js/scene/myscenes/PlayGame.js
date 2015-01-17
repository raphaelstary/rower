var PlayGame = (function (window, Event, Math, Key) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.events = services.events;
    }

    PlayGame.prototype.show = function (next) {
        var startX = 300;
        var startY = 500;
        var startRotation = -Math.PI / 2;

        var river = this.stage.drawRectangle(780/2, 1200/2, 780 - 25 - 25 + 25, 1200, '#81BEF7', true, undefined, 0);

        var rect = this.stage.drawRectangle(startX, startY, 50, 25, '#000', false, 1, 3);
        rect.rotation = startRotation;
        var circ = this.stage.drawCircle(rect.x, rect.y, 30, '#000', false, 1, 4);
        var line = this.stage.drawLine(rect.x, rect.y, circ.data.radius, '#000', 1, 4);
        line.anchorOffsetX = line.getWidthHalf();
        line.rotation = rect.rotation;

        var waterfall = this.stage.drawRectangle(780/2, 25, 1080, 50, '#5882FA', true, undefined, 1);
        var leftBanks = this.stage.drawRectangle(25, 1200/2, 50, 1200, '#088A08', true, undefined, 2);
        var rightBanks = this.stage.drawRectangle(780, 1200/2, 50, 1200, '#088A08', true, undefined, 2);
        var chaser = this.stage.drawRectangle(780/2, 1080, 1080, 50, '#B45F04', true, undefined, 1);

        var rowBoat = {
            setX: function (x) {
                this.x = x;
                this.drawable.x = x;
                this.collision.x = x;
                this.direction.x = x;
            },
            setY: function (y) {
                this.y = y;
                this.drawable.y = y;
                this.direction.y = y;
                this.collision.y = y;
            },
            setRotation: function (angle) {
                this.rotation = angle;
                this.drawable.rotation = angle;
                this.direction.rotation = angle;
            },
            x: startX,
            y: startY,
            rotation: startRotation,
            forceX: 0,
            forceY: 0,
            drawable: rect,
            direction: line,
            collision: circ,
            lastX: startX,
            lastY: startY
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
            rowBoat.setRotation(angle);
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

            rowBoat.lastX = rowBoat.x;
            rowBoat.lastY = rowBoat.y;
            rowBoat.setX(rowBoat.x + forceX);
            rowBoat.setY(rowBoat.y + forceY);
        });

        var buildings = [waterfall, leftBanks, rightBanks, chaser];
        this.events.subscribe(Event.TICK_COLLISION, function () {
            buildings.forEach(function (building) {
                if (circ.x + circ.data.radius > building.getCornerX() && circ.x - circ.data.radius < building.getEndX() &&
                    circ.y + circ.data.radius > building.getCornerY() && circ.y - circ.data.radius < building.getEndY()) {
                    console.log('collision');

                    rowBoat.setX(rowBoat.lastX);
                    rowBoat.setY(rowBoat.lastY);
                }
            });
        });
    };

    return PlayGame;
})(window, Event, Math, Key);