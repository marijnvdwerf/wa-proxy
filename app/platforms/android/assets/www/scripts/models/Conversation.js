define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: {
            name: '',
            id: '',
            messages: null
        },

        idAttribute:"_id"
    });

});
