var PlayGame = (function (window, Event, Math, Key, CoxSwain, Entity, Circle) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.events = services.events;
    }

    PlayGame.prototype.show = function (next) {
        var startX = 780 / 2;
        var startY = 1080 / 2;
        var startRotation = -Math.PI / 2;

        var distanceDrawable = this.stage.drawText(50, 50, '0', 20);
        var farthestPoint = startY;
        var yardsDrawable = this.stage.drawText(100, 50, 'yards', 20);

        var river = this.stage.drawRectangle(780 / 2, 1200 / 2, 780 - 25 - 25 + 25, 1200, '#81BEF7', true, undefined,
            0);

        var rect = this.stage.drawRectangle(startX, startY, 50, 25, '#000', false, 1, 3);
        rect.rotation = startRotation;
        var circ = this.stage.drawCircle(rect.x, rect.y, 30, '#000', false, 1, 4);
        var line = this.stage.drawLine(rect.x, rect.y, circ.data.radius, '#000', 1, 4);
        line.anchorOffsetX = line.getWidthHalf();
        line.rotation = rect.rotation;

        var waterfallSprite = this.stage.drawRectangle(780 / 2, 25, 1080, 50, '#5882FA', true, undefined, 1);
        var leftBanksSprite = this.stage.drawRectangle(25, 1200 / 2, 50, 1200, '#088A08', true, undefined, 2);
        var rightBanksSprite = this.stage.drawRectangle(780, 1200 / 2, 50, 1200, '#088A08', true, undefined, 2);
        var chaserSprite = this.stage.drawRectangle(780 / 2, 1080, 1080, 50, '#B45F04', true, undefined, 1);

        var rowBoat = new Entity(startX, startY, startRotation, rect, circ, line);
        rowBoat.debug = true;
        var chaser = new Entity(chaserSprite.x, chaserSprite.y, 0, chaserSprite, chaserSprite);
        var waterfall = new Entity(waterfallSprite.x, waterfallSprite.y, 0, waterfallSprite, waterfallSprite);
        var leftBanks = new Entity(leftBanksSprite.x, leftBanksSprite.y, 0, leftBanksSprite, leftBanksSprite);
        var rightBanks = new Entity(rightBanksSprite.x, rightBanksSprite.y, 0, rightBanksSprite, rightBanksSprite);

        var stoneDrawable_1 = this.stage.drawCircle(300, 300, 10, 'red', false);
        var stone_1 = new Entity(stoneDrawable_1.x, stoneDrawable_1.y, 0, stoneDrawable_1, stoneDrawable_1);
        var stoneDrawable_2 = this.stage.drawCircle(500, 500, 10, 'red', false);
        var stone_2 = new Entity(stoneDrawable_2.x, stoneDrawable_2.y, 0, stoneDrawable_2, stoneDrawable_2);

        var world = [chaser, waterfall, leftBanks, rightBanks, stone_1, stone_2];

        var viewPort = {
            x: startX,
            y: startY,
            width: 780,
            height: 1080,
            scale: 1,
            getCornerX: function () {
                return Math.floor(this.x - this.width * this.scale / 2);
            },
            getCornerY: function () {
                return Math.floor(this.y - this.height * this.scale / 2);
            },
            getEndX: function () {
                return Math.floor(this.x + this.width * this.scale / 2);
            },
            getEndY: function () {
                return Math.floor(this.y + this.height * this.scale / 2);
            }
        };

        var debugViewPort = this.stage.drawRectangle(viewPort.x, viewPort.y, viewPort.width, viewPort.height, 'red');

        var cox = new CoxSwain(rowBoat);

        var leftPressed = false;
        var rightPressed = false;
        this.events.subscribe(Event.KEY_BOARD, function (keyBoard) {
            if (!leftPressed && keyBoard[Key.LEFT]) {
                leftPressed = true;
                cox.paddleOnPortSide();
            } else if (leftPressed && !keyBoard[Key.LEFT]) {
                leftPressed = false;
            }
            if (!rightPressed && keyBoard[Key.RIGHT]) {
                rightPressed = true;
                cox.paddleOnBowSide();
            } else if (rightPressed && !keyBoard[Key.RIGHT]) {
                rightPressed = false;
            }
        });

        var leftBumper = false;
        var rightBumper = false;
        this.events.subscribe(Event.GAME_PAD, function (gamePad) {
            if (!leftBumper && gamePad.isLeftBumperPressed()) {
                leftBumper = true;
                cox.paddleOnPortSide();
            } else if (leftBumper && !gamePad.isLeftBumperPressed()) {
                leftBumper = false;
            }
            if (!rightBumper && gamePad.isRightBumperPressed()) {
                rightBumper = true;
                cox.paddleOnBowSide();
            } else if (rightBumper && !gamePad.isRightBumperPressed()) {
                rightBumper = false;
            }
        });

        var chaserMaxDistance = 300;
        var waterfallMinDistance = 300;
        this.events.subscribe(Event.TICK_MOVE, function () {
            var forceX = 0;
            var forceY = 0;

            // current - river upstream
            forceY += 2;

            var waterResistance = 0.9;
            rowBoat.forceX *= waterResistance;
            rowBoat.forceY *= waterResistance;

            forceX += rowBoat.forceX;
            forceY += rowBoat.forceY;

            rowBoat.lastX = rowBoat.x;
            rowBoat.lastY = rowBoat.y;
            rowBoat.x += Math.floor(forceX);
            rowBoat.y += Math.floor(forceY);

            chaser.y -= 2;
            if (chaser.y - rowBoat.y > chaserMaxDistance) {
                chaser.y = rowBoat.y + chaserMaxDistance;
            }
            if (rowBoat.y - waterfall.y < waterfallMinDistance) {
                waterfall.y = rowBoat.y - waterfallMinDistance;
            }
        });

        this.events.subscribe(Event.TICK_COLLISION, function () {
            world.forEach(function (element) {
                var radius = rowBoat.collision.getWidthHalf();
                if (element.collision.data instanceof Circle) {
                    if ( (element.x - rowBoat.x) * (element.x - rowBoat.x) + (element.y - rowBoat.y) * (element.y - rowBoat.y) <
                        (radius + element.collision.getWidthHalf()) * (radius + element.collision.getWidthHalf())) {

                        console.log('collision with obstacle');

                        rowBoat.x = rowBoat.lastX;
                        rowBoat.y = rowBoat.lastY;
                    }
                } else {
                    if (rowBoat.x + radius > element.getCornerX() && rowBoat.x - radius < element.getEndX() &&
                        rowBoat.y + radius > element.getCornerY() && rowBoat.y - radius < element.getEndY()) {

                        console.log('collision with banks');

                        rowBoat.x = rowBoat.lastX;
                        rowBoat.y = rowBoat.lastY;
                    }
                }
            });
        });

        this.events.subscribe(Event.TICK_CAMERA, function () {
            world.forEach(function (elem) {
                calcScreenPosition(elem);
            });
            calcScreenPosition(rowBoat);
            moveViewPort(rowBoat);
            calcPastDistance();
        });

        function calcPastDistance() {
            if (rowBoat.y < farthestPoint) {
                distanceDrawable.data.msg = (parseInt(distanceDrawable.data.msg) + farthestPoint - rowBoat.y).toString();
                farthestPoint = rowBoat.y;
            }
        }

        function calcScreenPosition(entity) {
            if (entity.getEndX() < viewPort.getCornerX() || entity.getCornerX() > viewPort.getEndX() ||
                entity.getEndY() < viewPort.getCornerY() || entity.getCornerY() > viewPort.getEndY()) {

                entity.sprite.show = false;
                if (entity.debug) {
                    if (entity.direction) {
                        entity.direction.show = false;
                    }
                    if (entity.collision) {
                        entity.collision.show = false;
                    }
                }
                return;
            }

            entity.sprite.show = true;

            entity.sprite.x = entity.x - viewPort.getCornerX() * viewPort.scale;
            entity.sprite.y = entity.y - viewPort.getCornerY() * viewPort.scale;
            entity.sprite.rotation = entity.rotation;
            entity.sprite.scale *= viewPort.scale;

            if (entity.debug) {
                if (entity.direction) {
                    entity.direction.show = true;
                    entity.direction.x = entity.sprite.x;
                    entity.direction.y = entity.sprite.y;
                    entity.direction.rotation = entity.sprite.rotation;
                }
                if (entity.collision) {
                    entity.collision.show = true;
                    entity.collision.x = entity.sprite.x;
                    entity.collision.y = entity.sprite.y;
                }
            }
        }

        function moveViewPort(anchorEntity) {
            viewPort.y = anchorEntity.y;
        }
    };

    return PlayGame;
})(window, Event, Math, Key, CoxSwain, Entity, Circle);