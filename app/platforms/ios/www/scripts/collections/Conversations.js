define([
    'jquery',
    'backbone',
    'models/Conversation'
], function ($, Backbone, ConversationModel) {

    return Backbone.Collection.extend({
        model: ConversationModel,

        url: 'http://localhost/conversations'
    });

});
