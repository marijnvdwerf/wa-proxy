require.config({

    paths: {

        // Core Libraries
        "jquery": "../vendor/jquery/jquery-1.10.2.min",
        "jquerymobile": "../vendor/jquery-mobile/jquery.mobile-1.3.2.min",
        "underscore": "../vendor/lodash/lodash.min",
        "backbone": "../vendor/backbone/backbone-min"

    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        }
    }

});

require([
    'jquery',
    'backbone',
    'app'
], function ($, Backbone, App) {

    $(document).on('mobileinit', function () {
        window.app = App.initialize();
    });

    require([
        'jquerymobile'
    ], function () {

    });
});
