define([
    'backbone',
    'models/Conversation'
], function (Backbone, ConversationModel) {

    return Backbone.Collection.extend({
        model: ConversationModel,

        url: 'http://marijnvdwerf-server.jit.su/conversations'
    });

});
