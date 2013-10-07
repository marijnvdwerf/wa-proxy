define([
    'jquery',
    'backbone',
    'models/Conversation',
    'collections/Conversations',
    'views/ConversationOverview',
    'views/Conversation'
], function ($, Backbone, ConversationModel, ConversationsCollection, ConversationOverviewView, ConversationView) {

    return Backbone.Router.extend({
        conversations: null,

        views: {
            conversationsOverview: null,
            conversation: null
        },

        notify: function (data) {
            navigator.notification.vibrate(2500);

            pebblePlugin.notifyPebble(function () {
            }, function () {
            }, data.name, data.message);
        },

        checkConnection: function () {
            var attributeValue = (navigator.connection.type === Connection.NONE) ? 'offline' : 'online';
            $('body').attr('data-connection', attributeValue);
        },

        // The Router constructor
        initialize: function () {
            // Check network state
            document.addEventListener('online', this.checkConnection, false);
            document.addEventListener('offline', this.checkConnection, false);
            document.addEventListener('resume', this.checkConnection, false);
            this.checkConnection();

            //this.notifyPebble();
            this.socket = io.connect("http://marijnvdwerf-server.jit.su");

            this.socket.on('message', $.proxy(function (message) {
                this.notify(message);
            }, this));


            this.conversations = new ConversationsCollection();

            this.views.conversationsOverview = new ConversationOverviewView({
                el: "#conversationOverview",
                collection: this.conversations
            });

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();
        },

        routes: {
            '': 'index',
            'conversations/:identifier': 'conversation'
        },

        index: function () {
            $.mobile.changePage('#conversationOverview', { reverse: false, changeHash: false });
            this.conversations.fetch();
        },

        conversation: function (identifier) {
            var conversationView = new ConversationView({
                el: '#conversation',
                model: this.conversations.findWhere({ identifier: identifier })
            });
            conversationView.render();
            $.mobile.changePage(conversationView.$el, { reverse: false, changeHash: false });
        }

    });

});
