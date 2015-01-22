window.onload = function () {
    "use strict";

    var app = Bootstrapper.gamePad().keyBoard().lowRez(256, 240).build(MyGameResources);
    app.start();
};