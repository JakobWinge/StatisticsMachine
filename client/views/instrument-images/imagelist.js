var ITEMS_INCREMENT = Meteor.settings.public.infiniteLength;

Template.imagelist.helpers({
    moreResults: function () {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(Images.find(Session.get("findObject")).count() < Session.get("itemsLimit"));
    },

    images: function () {

        var filterObject = Session.get("filterObject") || {state:"instrument"};

        if (filterObject.$and && filterObject.$and.length > 0) {
            resetInfiniteScroll();
        }


        return Images.find(filterObject, {limit: Session.get('itemsLimit')});
    }
});

function showMoreVisible() {
        var threshold, target = $("#showMoreResults");
        if (!target.length) {
            return;
        }


        threshold = $(window).scrollTop() + $(window).height() - target.height() + 150;

        if (target.offset().top < threshold) {
            if (!target.data("visible")) {
                // console.log("target became visible (inside viewable area)");
                target.data("visible", true);
                Session.set("itemsLimit",
                    Session.get("itemsLimit") + ITEMS_INCREMENT);
            }
        } else {
            if (target.data("visible")) {
                // console.log("target became invisible (below viewable arae)");
                target.data("visible", false);
            }
        }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);

function resetInfiniteScroll() {
    Session.set('itemsLimit', ITEMS_INCREMENT);
}