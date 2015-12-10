RouterAutoscroll.animationDuration = 1;

Router.route('/', {
    name: 'instrument-images',
    template: 'instrument-images',
    onBeforeAction: function () {
        Session.set("itemsLimit", Meteor.settings.public.infiniteLength || 5);
        this.next();
    }
});
Router.route('/options', {
    name: "options",
    template: "options"
});
Router.route('/picture-images', {
    name: 'picture-images',
    template: 'picture-images',
    onBeforeAction: function () {
        Session.set("itemsLimit", Meteor.settings.public.infiniteLength || 5);
        this.next();
    }
});

Router.route('/analyzer', {
    name:"analyzer-random",
    action: function() {
        var record = Images.findOne({'state' : {$nin:["instrument", "picture", "skipState"]}, video:true});
        Router.go('/analyzer/'+record._id);
    }
});

Router.route('/analyzer/:_id', {
    name: "analyzer",
    template: "analyzer",
    onBeforeAction: function () {
        if(this.params._id !== "default") {
            var returnObject = Images.findOne({ _id: this.params._id });
            Session.set("state", returnObject.state);
            this.next();
        } else {
            Session.set("state", "");
            this.next();
        }
    },
    data: function() {
        if(this.params._id !== "default") {
            return Images.findOne({ _id: this.params._id });
        }
        return Images.findOne(Images.findOne({'state' : {$nin:["instrument", "picture"]}}));
    }
});


Router.route('/statistics', {
    name: "statistics",
    template: "statistics"
});

Router.configure({
    layoutTemplate: 'main',
    onBeforeAction: function() {

        this.next();
    }
});