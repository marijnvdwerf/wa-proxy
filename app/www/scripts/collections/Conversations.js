define([
    'jquery',
    'backbone',
    'models/Conversation'
], function ($, Backbone, ConversationModel) {

    return Backbone.Collection.extend({
        model: ConversationModel,

        sampleData: [
            {
                id: 1,
                identifier: '1@test.nl',
                name: 'Codesoup BV',
                messages: [
                    {
                        text: 'testA'
                    },
                    {
                        text: 'testB'
                    }
                ]
            },
            {
                id: 2,
                identifier: '2@test.nl',
                name: 'Proftaak P13-14',
                messages: []
            },
            {
                id: 3,
                identifier: '3@test.nl',
                name: 'Proftaak P11-12',
                messages: []
            }
        ],

        sync: function (method, model, options) {
            var self = this;
            var deferred = $.Deferred();

            setTimeout(function () {
                console.log('on deferred');
                options.success(self.sampleData);
                deferred.resolve();

            }, 1000);

            return deferred;
        }
    });

});
