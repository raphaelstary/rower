var PlayGame = (function (window, Event, Math) {
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
        var circ = this.stage.drawCircle(rect.x, rect.y, 100, '#000');
        var line = this.stage.drawLine(rect.x, rect.y, circ.data.radius, '#000');
        line.anchorOffsetX = line.getWidthHalf();
        line.rotation = rect.rotation;

        var rowBoat = {
            forceX: 0,
            forceY: 0,
            drawable: rect
        };

        function paddleOnPortSide() { // backbord
            paddle(-40);
        }

        function paddleOnBowSide() { // star board - steuerbord
            paddle(40);
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

        this.events.subscribe(Event.TICK_MOVE, function () {
            var forceX = 0;
            var forceY = 0;

            // current - river upstream
            //forceY += 1;

            forceX += rowBoat.forceX;
            forceY += rowBoat.forceY;

            if (rowBoat.forceX != 0) {

            }
            if (rowBoat.forceY != 0) {

            }
            //rowBoat.drawable.rotation = Math.atan2(rowBoat.forceX, rowBoat.forceY) - Math.PI/2;
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
})(window, Event, Math);