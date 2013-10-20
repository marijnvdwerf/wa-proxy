define([
    'jquery',
    'models/Conversation',
    'collections/Conversations',
    'views/ConversationOverview',
    'views/Conversation'
], function ($, ConversationModel, ConversationsCollection, ConversationOverviewView, ConversationView) {

    return {
        conversations: null,

        views: {
            conversationsOverview: null,
            conversation: null
        },

        connectionState: 'offline',

        initialize: function () {
            this.socket = io.connect("http://marijnvdwerf-server.jit.su:80");

            this.socket.on('connect', $.proxy(function () {
                this.updateConnectionState('online');
            }, this));

            this.socket.on('message', $.proxy(function (data) {
                var conversation = this.conversations.findWhere({identifier: data.conversationIdentifier});
                if (conversation == null) {
                    conversation = new ConversationModel({
                        identifier: data.conversationIdentifier
                    });
                    this.conversations.push(conversation);
                }

                conversation.get('messages').push(data.message);

                this.notify(data.message);
                this.conversations.sort();
            }, this));

            // Check network state
            this.checkConnection();
            window.addEventListener('online', $.proxy(this.checkConnection, this), false);
            window.addEventListener('offline', $.proxy(this.checkConnection, this), false);
            window.addEventListener('resume', $.proxy(function () {
                alert('resume!!!');
                this.checkConnection();
            }, this), false);

            this.conversations = new ConversationsCollection();

            this.views.conversationsOverview = new ConversationOverviewView({
                el: '#conversations',
                collection: this.conversations
            });

            this.views.conversation = new ConversationView({
                el: '#conversation'
            });

            this.conversations.fetch();

            $('body').on('click', 'a[href="#conversations"]', function () {
                $('#conversations').panel('toggle');
            });

            return this;
        },

        notify: function (data) {
            try {
                navigator.notification.vibrate(2500);

                pebblePlugin.notifyPebble(function () {
                }, function () {
                }, data.name, data.message);
            } catch (error) {

            }
        },

        checkConnection: function () {
            if (navigator.onLine) {
                if (!this.socket.socket.connected) {
                    this.socket.socket.connect();
                    this.updateConnectionState('connecting');
                }
            } else {
                this.socket.socket.disconnect();
                this.updateConnectionState('offline');
            }
        },

        updateConnectionState: function (state) {
            this.connectionState = state;
            $('body').attr('data-state', state);
        },

        openConversation: function (identifier) {
            var conversation = this.conversations.findWhere({ identifier: identifier });
            this.views.conversation.setModel(conversation);
            $('#conversations').panel('close');
        }
    };

});
