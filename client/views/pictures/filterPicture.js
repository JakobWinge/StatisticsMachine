var tags = []; // TODO

var ITEMS_INCREMENT = Meteor.settings.public.infiniteLength || 5;


function resetInfiniteScroll() {
    Session.set('itemsLimit', ITEMS_INCREMENT);
}

function pictureFilterChanged() {
    var schoolClass = Session.get("filterInputClass");
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

    if (conditions.length > 0) {
     resetInfiniteScroll();
    }

    conditions.push({state: "picture"});

    findObject = {$and: conditions};

    Session.set("pictureFilterObject", findObject);
}


Template.filterPicture.helpers({
    schoolClasses: function () {
        return SchoolClasses.find({});
    },
    sensors: function () {
        return Sensors.find({});
    },

    filterTags: function() {
        tags = Session.get("pictureFilterTags");
        return (tags || []).join(",");
    },
    filterComment: function() {
        return Session.get("pictureFilterComment");
    },
    filterClassChecked: function () {
        if ((!this.value && !Session.get('filterInputClass')) || this.value === Session.get('filterInputClass')) {
            return "selected";
        }
    },

    filterVideoOnlyChecked: function () {
        if (Session.get('filterVideoOnly')) {
            return "checked";
        }
    }

});

Template.filterPicture.events(
    {
        "change #filterInputClass": function (event) {
            Session.set("filterInputClass", event.target.value);
        },
        "change #filterComment": function (event) {
            Session.set("pictureFilterComment", event.target.value);
        },
        "change #filterVideoOnly": function (event) {
            Session.set("filterVideoOnly", event.target.checked);
        }
    }
);

Template.filterPicture.onRendered(function() {

    Tracker.autorun(pictureFilterChanged.bind(this));

    var self = this,
        elem = $(this.find('.tags-input'));


    elem.tokenfield({
        typeahead: [null, {
            name: 'tags',
            displayKey: 'value',
            //source: tags.ttAdapter()
            source: function(query, syncResults, asyncResults) {

                var suggestedTags = ImageTags.find({value: {
                    $regex: "^"+query,
                    $options: "i",
                    $nin: tags || []
                }}).fetch();
                //console.log("Source", query, suggestedTags, self.data.tags);
                syncResults(suggestedTags);
                //asyncResults([]); // Request server somehow?
            }
        }],
        minWidth:23
    });

    var setFilterTags = function() {
        var tagObjects = elem.tokenfield('getTokens');
        tags = tagObjects.map(function(tag) {
            return tag.value;
        });
        console.log("Filter tags", tags);
        Session.set("pictureFilterTags", tags);
    };

    // Avoid duplicates and none existant (TODO)
    elem.on('tokenfield:createtoken', function (event) {
        // No duplicates
        if (tags && tags.indexOf(event.attrs.value) > -1) {
            event.preventDefault();
            return;
        }
    });

    elem.on('tokenfield:createdtoken', function (event) {
        setFilterTags();
    });

    elem.on('tokenfield:removedtoken', function (event) {
        setFilterTags();
    });

});