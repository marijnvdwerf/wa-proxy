define([
    'backbone',
    'collections/Messages',
    'models/Message'
], function (Backbone, MessagesCollection, MessageModel) {

    var MEDIA_TYPE_VCARD = 'vcard';

    return Backbone.Model.extend({
        defaults: {
            subject: '',
            identifier: '',
            messages: null,
            current: false
        },

        idAttribute: "_id",

        initialize: function () {
            this.set('messages', new MessagesCollection(this.get('messages')));
            this.listenTo(this.get('messages'), 'sort', this.onMessage);
        },

        getLastUpdated: function () {
            if (this.get('messages').length > 0) {
                return this.get('messages').last().get('time');
            }

            return  Math.floor(new Date().getTime() / 1000);
        },

        isGroupChat: function () {
            return (this.get('identifier').indexOf('@g.us') !== -1);
        },

        onMessage: function () {
            this.trigger('change');
        },

        update: function (data) {
            if (data.subject != undefined && data.subject !== this.get('subject')) {
                this.set('subject', data.subject);
            }

            if (data.messages != undefined && data.messages.length > 0) {
                this.get('messages').add(data.messages);
            }
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

        sendMedia: function (body, mediaType, media) {
            var self = this;

            media = JSON.parse(JSON.stringify(media));

            var message = new MessageModel({
                from: 'me',
                time: Math.floor(new Date().getTime() / 1000),
                body: body,
                status: 'sending'
            });

            // store attachment
            message.set(mediaType, media);

            this.get('messages').add(message);

            var postData = {
                message: body
            };
            postData[mediaType] = media;

            $.ajax('http://marijnvdwerf-server.jit.su/conversations/' + this.get('identifier'), {
                method: 'POST',
                data: postData
            }).success(function () {
                    message.set('status', 'sent');
                });
        },

        sendContact: function (contact) {
            console.log('Models/Conversation::sendContact()');
            this.sendMedia('CONTACT: ' + contact.name.formatted, MEDIA_TYPE_VCARD, contact);
        }
    });

});
