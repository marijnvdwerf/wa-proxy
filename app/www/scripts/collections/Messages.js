define([
    'backbone',
    'models/Message'
], function (Backbone, MessageModel) {

    return Backbone.Collection.extend({
        model: MessageModel
    });

});
