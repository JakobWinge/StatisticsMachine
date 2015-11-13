Router.map(function() {
    this.route('methodExample', {
        path: '/add_image',
        where: 'server',
        action: function() {
            // GET, POST, PUT, DELETE
            var requestMethod = this.request.method;
            // Data from a POST request
            var imageData = this.request.body;

            imageData.sensors = {port1: null, port2 : null, port3 : null, port4: null};
            imageData.rating = null;
            imageData.soundselector = null;
            imageData.misconnections = null;
            imageData.comment = null;

            Images.insert(imageData);
            // Could be, e.g. application/xml, etc.
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end('{"success":true}');
        }
    });
});

Router.route('/', {
    name: 'instrument-images',
    template: 'instrument-images',
    onBeforeAction: function () {
        Session.set("itemsLimit", Meteor.settings.public.infiniteLength);
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
        Session.set("itemsLimit", Meteor.settings.public.infiniteLength);
        this.next();
    }
});
Router.route('/analyzer/:_id', {
    name: "analyzer",
    template: "analyzer",
    onBeforeAction: function () {
        Session.set("instrumentForRef", "");
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
        window.scrollTo(0, 0);
        this.next();
    }
});