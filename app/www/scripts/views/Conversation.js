define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.View.extend({
        render: function () {
            this.template = _.template($('script.conversation').html(), this.model.toJSON());
            console.log(this.$el.find('[data-role="content"]'));
            this.$el.find('[data-role="content"]')
                .html(this.template);

            this.$el.find('[data-role="header"] h1').text(this.model.get('name'));

            return this;
        }
    });

});
