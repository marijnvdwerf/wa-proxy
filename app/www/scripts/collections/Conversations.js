define([
    'backbone',
    'models/Conversation'
], function (Backbone, ConversationModel) {

    return Backbone.Collection.extend({
        model: ConversationModel,

        url: 'http://marijnvdwerf-server.jit.su/conversations',

        comparator: function (conversationA, conversationB) {
            return conversationB.get('messages').last().get('time') - conversationA.get('messages').last().get('time');
        },

        setCurrent: function (identifier) {
            this.forEach(function (conversation) {
                conversation.set('current', false);
            });
            this.findWhere({ identifier: identifier }).set('current', true);
            this.trigger('changeCurrent');
        }
    });

});
