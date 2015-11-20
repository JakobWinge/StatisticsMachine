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
            imageData.decorationRating = null;
            imageData.instrumentRating = null;
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