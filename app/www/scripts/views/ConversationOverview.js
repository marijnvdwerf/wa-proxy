define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.View.extend({

        initialize: function () {
            this.listenTo(this.collection, 'add', this.render);
        },

        render: function () {
            this.template = _.template($("script.conversationOverview").html(), { "collection": this.collection });
            this.$el.find("ul")
                .html(this.template)
                .trigger('create')
                .listview('refresh');

            return this;
        }

    });

});
