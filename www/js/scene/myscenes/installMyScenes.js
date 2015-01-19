var installMyScenes = (function (SceneManager, PlayGame, StartScreen, EndScreen) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var sceneManager = new SceneManager();
        var startScreen = new StartScreen(sceneServices);
        var gameScene = new PlayGame(sceneServices);
        var endScreen = new EndScreen(sceneServices);

        sceneManager.add(startScreen.show.bind(startScreen), true);
        sceneManager.add(gameScene.show.bind(gameScene));
        sceneManager.add(endScreen.show.bind(endScreen));

        return sceneManager;
    }

    return installMyScenes;
})(SceneManager, PlayGame, StartScreen, EndScreen);