define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.View.extend({

        initialize: function () {
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sort', this.render);

            this.$el.on('click', 'a', $.proxy(this.openConversation, this));
        },

        render: function () {
            this.template = _.template($("script.conversationOverview").html(), { "collection": this.collection });
            this.$el.find("ul")
                .html(this.template)
                .trigger('create')
                .listview('refresh');

            return this;
        },

        openConversation: function (e) {
            var target = $(e.currentTarget);
            window.app.openConversation(target.data('id'))
        }
    });

});
