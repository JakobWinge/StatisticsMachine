var localhost = false;
var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";


Template.instrument.helpers({

    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    }

});
