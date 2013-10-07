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

        notifyPebble:function(){
            alert('hoi');
            pebblePlugin.notifyPebble(function(){},function(){},"Richard","hoi");
        },

        // The Router constructor
        initialize: function () {

            //this.notifyPebble();
            this.socket = io.connect("http://marijnvdwerf-server.jit.su");

            this.socket.on('message', function(data){
                pebblePlugin.notifyPebble(function(){},function(){},data.name,data.message);
            })

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
