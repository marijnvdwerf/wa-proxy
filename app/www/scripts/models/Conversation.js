define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: {
            name: '',
            id: '',
            messages: null
        },

        idAttribute: "_id",

        sendMessage: function (message) {
            var self = this;

            $.ajax('http://marijnvdwerf-server.jit.su/conversations/' + this.get('identifier'), {
                method: 'POST',
                data: {
                    message: message
                }
            }).success(function () {
                    alert('sent');
                });
        }
    });

});
