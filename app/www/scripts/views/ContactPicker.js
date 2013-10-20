define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.View.extend({

        contacts: [],

        initialize: function () {
            this.findContacts();
        },

        render: function () {
            var template = _.template($('script.contactPicker').html(), { contacts: this.contacts });
            this.$el.find('[data-role="listview"]')
                .html(template)
                .on('click', 'li', $.proxy(this.sendContact, this));

            if (this.$el.data('mobile-page') !== undefined) {
                // After the first appearance, we need to notify the page that it needs to be styled
                this.$el.trigger('create');
            }

            return this;
        },

        findContacts: function () {
            console.log('ContactPicker::findContacts');
            var self = this;

            if (!navigator.contacts) {
                // Don't do anything if contacts can't be accessed on this platform
                self.contacts = [
                    {
                        id: 1,
                        name: {
                            formatted: 'test'
                        }
                    }
                ];
                self.render();
                return;
            }

            var options = new ContactFindOptions();
            options.filter = '';
            options.multiple = true;
            var fields = ["displayName", "name", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "note", "urls"];
            navigator.contacts.find(fields, function (contacts) {
                contacts = _.sortBy(contacts, function (contact) {
                    return contact.name.formatted;
                });
                self.contacts = contacts;
                self.render();
            }, function () {
            }, options);
        },

        sendContact: function (e) {
            // get clicked item
            var target = $(e.currentTarget);

            // send contact associated with item
            var contact = _.findWhere(this.contacts, {id: target.data('id')});
            this.model.sendContact(contact);

            // close overlay
            this.$el.dialog('close');
        }
    });
});
