define([
    'jquery',
    'backbone',
    'socket.io'
], function ($, Backbone, io) {

    return Backbone.Model.extend({

        socket: function (url) {
            var socket = io.connect("http://marijnvdwerf-server.nodejitsu.com/");
            return socket;
        },

        getConversations: function (url) {
            this.socket.emit('getConversations');

            this.socket.on('conversations', function(data){
                console.log(data);
            });
        },

        sendMessage: function (msg) {
            this.socket.emit('message', {"message" : msg.text, "messageId": msg.msgId});
        },

        sendContact: function (contact) {

        }
    });

});