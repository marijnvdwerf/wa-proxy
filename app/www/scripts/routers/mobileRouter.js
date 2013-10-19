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
            try {
                navigator.notification.vibrate(2500);

                pebblePlugin.notifyPebble(function () {
                }, function () {
                }, data.name, data.message);
            } catch (error) {

            }
        },

        checkConnection: function () {
            if(navigator.onLine) {
                if(!this.socket.socket.connected) {
                    this.socket.socket.connect();
                    this.updateConnectionState('connecting');
                }
            } else {
                this.socket.socket.disconnect();
                this.updateConnectionState('offline');
            }
        },

        connectionState: 'offline',
        updateConnectionState: function(state) {
            this.connectionState = state;
            $('body').attr('data-state', state);
        },

        // The Router constructor
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
            window.addEventListener('resume', $.proxy(function(){
                alert('resume!!!');
                this.checkConnection();
            }, this), false);

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
