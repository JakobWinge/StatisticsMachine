Template.options.events ({
    'click .scanfiles': function () {
        // increment the counter when button is clicked
        Meteor.call('scanFiles');
        Session.set('counter', Session.get('counter') + 1);
    },
    'click .resetdatabase': function (e) {
        Meteor.call('resetdatabase');
    }
});