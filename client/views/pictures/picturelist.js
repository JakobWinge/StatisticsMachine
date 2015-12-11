Template.picturelist.helpers({
    moreResults: function () {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(Images.find(Session.get("pictureFilterObject")).count() < Session.get("itemsLimit"));
    },

    /*pictures: function () {
        Session.set("findObjectPictures", {'state': 'picture'});
        return Images.find({'state': 'picture'}, {limit: Session.get('itemsLimit')});
    },*/

    pictures: function () {
        /*var schoolClass = Session.get("filterInputClass");
        var comment = Session.get("pictureFilterComment");
        var tags = Session.get("pictureFilterTags");
        var videoOnly = Session.get("filterVideoOnly");

        var findObject = {};
        var conditions = [];

        if (schoolClass !== "" && schoolClass !== undefined) {
            //findObject.class = schoolClass;
            conditions.push({"class": schoolClass});
        }

        if (tags && tags.length > 0) {
            conditions.push({"tags": {$all: tags}});
        }

        if (comment) {
            conditions.push({comment: {
                $regex: '.*' + comment + '.*',
                $options: "i"
            }});
        }

        if (videoOnly) {
            conditions.push({video: true});
        }

        *//*if (conditions.length > 0) {
            resetInfiniteScroll();
        }*//*

        conditions.push({state: "picture"});

        findObject = {$and: conditions};

        Session.set("findObjectPictures", findObject);*/

        var filterObject = Session.get("pictureFilterObject") || {state:"picture"};
        console.log("Get pictures", filterObject);


        return Images.find(filterObject, {limit: Session.get('itemsLimit'), sort: {class: 1, baseName: 1}});
    }
});