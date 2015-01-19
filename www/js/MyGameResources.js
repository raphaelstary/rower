var MyGameResources = (function (ImageResourceHelper) {
    "use strict";

    // your files
    var images = {};
    function registerFiles(resourceLoader) {
        var imgNames = ['chaser', 'river', 'rowboat', 'stone'];
        // add your files to the resource loader for downloading
        ImageResourceHelper.register(resourceLoader, imgNames, images);

        return imgNames.length; // number of registered files
    }

    function processFiles() {
        // process your downloaded files
        var gfxCache = ImageResourceHelper.process(images);

        return {
            // services created with downloaded files
            gfxCache: gfxCache
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(ImageResourceHelper);