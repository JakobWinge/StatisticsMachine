var ITEMS_INCREMENT = Meteor.settings.public.infiniteLength;

Template.picturelist.helpers({
    moreResults: function () {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(Images.find(Session.get("findObjectPictures")).count() < Session.get("itemsLimit"));
    },

    pictures: function () {
        Session.set("findObjectPictures", {'state': 'picture'});
        return Images.find({'state': 'picture'}, {limit: Session.get('itemsLimit')});
    }
});