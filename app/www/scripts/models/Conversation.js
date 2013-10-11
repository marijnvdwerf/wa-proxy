define([
    'backbone',
    'collections/Messages',
    'models/Message'
], function (Backbone, MessagesCollection, MessageModel) {

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

        sendMessage: function (body) {
            var self = this;

            var message = new MessageModel({
                from: 'me',
                time: Math.floor(new Date().getTime() / 1000),
                body: body,
                status: 'sending'
            });

            this.get('messages').add(message);

            $.ajax('http://marijnvdwerf-server.jit.su/conversations/' + this.get('identifier'), {
                method: 'POST',
                data: {
                    message: body
                }
            }).success(function () {
                    message.set('status', 'sent');
                });
        },

        parse: function (response, options) {
            console.log('parse');
            response.messages = new MessagesCollection(response.messages);
            return response;
        }
    });

});
