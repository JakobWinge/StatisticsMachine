var tags = []; // TODO

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
    var self = this,
        elem = $(this.find('.tags-input'));

//console.log("On tag input rendered", elem);

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

    /*var saveTags = function(tagObjects) {
        var tags = tagObjects.map(function(tag) {
            return tag.value;
        });
        console.log("Save tags to item", tags, self.data._id);
        Images.update(self.data._id, {
            $set: {tags: tags}
        });
        self.data.tags = tags;
    }*/

    // Avoid duplicates and none existant (TODO)
    elem.on('tokenfield:createtoken', function (event) {
        // No duplicates
        if (tags && tags.indexOf(event.attrs.value) > -1) {
            event.preventDefault();
            return;
        }

        // No none-existing tags
        /*var available_tags = ImageTags.find().fetch();
        var exists = false;
        $.each(available_tags, function(index, tag) {
            if (tag.value === event.attrs.value)
                exists = true;
        });
        if(!exists) {
            event.preventDefault();
        }*/
    });

    elem.on('tokenfield:createdtoken', function (event) {
        setFilterTags();
    });

    elem.on('tokenfield:removedtoken', function (event) {
        setFilterTags();
    });

});