var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureChanger.helpers({
    instrument : function() {
        console.log(this);
        return Images.find({'class' : this.class, 'state' : 'instrument'})
    },
    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    },
    chosenRef: function() {
        return Session.get("instrumentForRef");
    }
});