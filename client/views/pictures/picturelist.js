var ITEMS_INCREMENT = Meteor.settings.public.infiniteLength;

Template.picturelist.helpers({
    moreResults: function () {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(Images.find(Session.get("findObjectPictures")).count() < Session.get("itemsLimitPictures"));
    },

    pictures: function () {
        Session.set("findObjectPictures", {'state': 'picture'});
        return Images.find({'state': 'picture'}, {limit: Session.get('itemsLimitPictures')});
    }
});

function showMoreVisible() {
    if (Router.current().route.getName() === 'picture-images') {


        var threshold, target = $("#showMoreResultsPictures");
        if (!target.length) {
            console.log("length null");
            return;
        }


        threshold = $(window).scrollTop() + $(window).height() - target.height();

        if (target.offset().top < threshold) {

            if (!target.data("visible")) {
                //console.log("target became visible (inside viewable area)");
                target.data("visible", true);
                Session.set("itemsLimitPictures",
                    Session.get("itemsLimitPictures") + ITEMS_INCREMENT);
            }
        } else {
            if (target.data("visible")) {
                // console.log("target became invisible (below viewable arae)");
                target.data("visible", false);
            }
        }
    }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);