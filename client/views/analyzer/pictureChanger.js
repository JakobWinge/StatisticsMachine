var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureChanger.events({
    'keyup #inputComment': function(event) {
        var x = event.target.value;
        Images.update(this._id, {
            $set: {'comment': x}
        });
    }
});