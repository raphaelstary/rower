var CoxSwain = (function (Vectors) {
    "use strict";

    function CoxSwain(rowBoat) {
        this.rowBoat = rowBoat;
    }
    CoxSwain.prototype.paddleOnBowSide = function () {
        this.__paddle(30);
    };
    CoxSwain.prototype.paddleOnPortSide = function () {
        this.__paddle(-30);
    };
    CoxSwain.prototype.__paddle = function (degrees) {
        var magnitude = 4;
        this.rowBoat.rotation += Vectors.toRadians(degrees);
        this.rowBoat.forceX += Vectors.getX(0, magnitude, this.rowBoat.rotation);
        this.rowBoat.forceY += Vectors.getY(0, magnitude, this.rowBoat.rotation);
    };

    return CoxSwain;
})(Vectors);