require.config({

    paths: {

        // Core Libraries
        "jquery": "../vendor/jquery/jquery-2.0.3.min",
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
    'routers/mobileRouter'
], function ($, Backbone, Mobile) {

    $(document).on('mobileinit', function () {
        // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
        $.mobile.linkBindingEnabled = false;

        // Disabling this will prevent jQuery Mobile from handling hash changes
        $.mobile.hashListeningEnabled = false;
    });

    require([
        'jquerymobile'
    ], function () {
        // Instantiates a new Backbone.js Mobile Router
        this.router = new Mobile();

        var defs = $.mobile.changePage.defaults;
        $('body').on('click', 'a[data-rel="back"]', function (event) {
            var $this = $(this);

            if ($this.attr('data-transition')) {
                $.mobile.changePage.defaults.transition = $this.attr('data-transition');
            } else {
                $.mobile.changePage.defaults.transition = defs.transition;
            }

            if ($this.attr('data-direction')) {
                $.mobile.changePage.defaults.reverse = $this.attr('data-direction') == 'reverse';
            } else {
                $.mobile.changePage.defaults.reverse = false;
            }

            if ($this.attr('data-rel') === 'back') {
                window.history.back();
                return false;
            }
        });
    });
});
