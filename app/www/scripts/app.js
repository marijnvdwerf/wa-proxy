define([
    'jquery',
    'models/Conversation',
    'collections/Conversations',
    'views/ConversationOverview',
    'views/Conversation',
    'views/ContactPicker'
], function ($, ConversationModel, ConversationsCollection, ConversationOverviewView, ConversationView, ContactPickerView) {

    return {
        conversations: null,

        views: {
            conversationsOverview: null,
            conversation: null,
            contactPicker: null
        },

        connectionState: 'offline',

        initialize: function () {
            this.socket = io.connect("http://marijnvdwerf-server.jit.su:80");

            this.socket.on('connect', $.proxy(function () {
                this.updateConnectionState('online');
            }, this));

            this.socket.on('message', $.proxy(function (conversationData) {
                var conversation = this.conversations.findWhere({identifier: conversationData.identifier});
                if (conversation == null) {
                    conversation = new ConversationModel(conversationData);
                    this.conversations.push(conversation);
                } else {
                    conversation.update(conversationData);
                }

                if (conversationData.messages.length > 0) {
                    this.notify(conversationData.messages[0]);
                }

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

            this.views.contactPicker = new ContactPickerView({
                el: '#contactPicker'
            });

            this.conversations.fetch();

            this.conversations.on('sync', $.proxy(function () {
                if (this.conversations.length > 0) {
                    this.openConversation(this.conversations.first().get('identifier'));
                }
            }, this));

            $('body').on('click', 'a[href="#conversations"]', function () {
                $('#conversations').panel('toggle');
            });

            return this;
        },

        notify: function (data) {
            try {
                navigator.notification.vibrate(200);
                pebblePlugin.notifyPebble(function () {
                }, function () {
                }, data.name, data.body);
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


        pickContactForModel: function (model) {
            this.views.contactPicker.model = model;
            this.views.contactPicker.findContacts();
            $.mobile.changePage('#contactPicker');
        },

        openConversation: function (identifier) {
            var conversation = this.conversations.findWhere({ identifier: identifier });
            this.conversations.setCurrent(identifier);
            this.views.conversation.setModel(conversation);
            $('#conversations').panel('close');
        }
    }
        ;

})
;
