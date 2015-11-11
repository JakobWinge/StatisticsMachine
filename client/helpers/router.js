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
    template: 'instrument-images'
});
Router.route('/options', {
    name: "options",
    template: "options"
});
Router.route('/pictures', {
    name: 'pictures',
    template: 'pictures'
});
Router.route('/analyzer', {
    name: "analyzer",
    template: "analyzer"
});
Router.route('/statistics', {
    name: "statistics",
    template: "statistics"
});

Router.configure({
    layoutTemplate: 'main'
});