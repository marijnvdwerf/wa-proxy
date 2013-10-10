define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.View.extend({
        events: {
            'submit form': 'postMessage'
        },

        render: function () {
            console.log(this.model.get('identifier'));
            this.template = _.template($('script.conversation').html(), {conversation: this.model.toJSON(), messages:this.model.get("messages").toJSON()});
            console.log(this.$el.find('[data-role="content"]'));
            this.$el.find('[data-role="content"]')
                .html(this.template);

            this.$el.find('[data-role="header"] h1').text(this.model.get('name'));

            return this;
        },

        postMessage: function() {
            var message = this.$el.find('input[name=message]').val();
            this.model.sendMessage(message);
            return false;
        }
    });

});
