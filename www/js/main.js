window.onload = function () {
    "use strict";

    var app = Bootstrapper.gamePad().keyBoard().build(MyGameResources);
    app.start();
};