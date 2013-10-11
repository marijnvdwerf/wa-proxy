define([
    'backbone',
    'collections/Messages'
], function (Backbone, MessagesCollection) {

    return Backbone.Model.extend({
        defaults: {
            name: '',
            id: '',
            messages: null
        },

        idAttribute: "_id",

        initialize: function () {
            this.listenTo(this.get('messages'), 'sort', this.onMessage);
        },

        onMessage: function () {
            this.trigger('change');
        },

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
        },

        parse: function (response, options) {
            console.log('parse');
            response.messages = new MessagesCollection(response.messages);
            return response;
        }
    });

});
