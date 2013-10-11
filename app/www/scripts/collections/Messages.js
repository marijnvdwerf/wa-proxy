define([
    'backbone',
    'models/Message'
], function (Backbone, MessageModel) {

    return Backbone.Collection.extend({
        model: MessageModel,

        initialize: function () {
            this.listenTo(this, 'add', this.sort);
            this.listenTo(this, 'remove', this.sort);
            this.listenTo(this, 'reset', this.sort);
        },

        comparator: function (messageA, messageB) {
            return messageB.get('time') - messageA.get('time');
        }
    });

});
