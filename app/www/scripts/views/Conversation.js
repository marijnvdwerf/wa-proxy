define([
    'jquery',
    'backbone',
    'views/ContactPicker'
], function ($, Backbone, ContactPickerView) {

    return Backbone.View.extend({
        events: {
            'submit form': 'postMessage',
            'click .sendContact': 'sendContact'
        },

        initialize: function() {
            if(this.model) {

            }
        },

        setModel: function(model) {
            this.model = model;
            this.listenTo(this.model, 'change', this.render);
            this.render();
            this.$el.find('input').val('');
        },

        render: function () {
            this.template = _.template($('script.conversation').html(), {conversation: this.model});
            this.$el.find('ul').html(this.template);

            this.$el.find('[data-role="header"] h1').text(this.model.get('name'));

            return this;
        },

        postMessage: function () {
            var message = this.$el.find('input[name=message]').val();
            this.model.sendMessage(message);

            // clear input
            this.$el.find('input').val('');

            // don't submit form
            return false;
        },

        sendContact: function() {
            window.app.pickContactForModel(this.model);
        }
    });

});
