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
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.template = _.template($('script.conversation').html(), {conversation: this.model.toJSON(), messages: this.model.get("messages").toJSON()});
            this.$el.find('ul').html(this.template);

            this.$el.find('[data-role="header"] h1').text(this.model.get('name'));

            return this;
        },

        postMessage: function () {
            var message = this.$el.find('input[name=message]').val();
            this.model.sendMessage(message);
            return false;
        },

        sendContact: function() {
            var pickerView = new ContactPickerView({
                el: '#contactPicker',
                model: this.model
            });

            $.mobile.changePage('#contactPicker');
        }
    });

});
