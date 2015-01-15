var installMyScenes = (function (SceneManager, PlayGame) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var sceneManager = new SceneManager();
        var gameScene = new PlayGame(sceneServices);
        sceneManager.add(gameScene.show.bind(gameScene));

        return sceneManager;
    }

    return installMyScenes;
})(SceneManager, PlayGame);