Template.tagInput.onRendered(function() {
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
                    $nin: self.data.tags || []
                }}).fetch();
                //console.log("Source", query, suggestedTags, self.data.tags);
                syncResults(suggestedTags);
                //asyncResults([]); // Request server somehow?
            }
        }],
        minWidth:23
    });

    var saveTags = function(tagObjects) {
        var tags = tagObjects.map(function(tag) {
            return tag.value;
        });
        console.log("Save tags to item", tags, self.data._id);
        Images.update(self.data._id, {
            $set: {tags: tags}
        });
        self.data.tags = tags;
    };

    // Avoid duplicates
    elem.on('tokenfield:createtoken', function (event) {
        console.log("Createtoken", self.data);
        if (self.data.tags && self.data.tags.indexOf(event.attrs.value) > -1) {
            event.preventDefault();
        }
    });

    elem.on('tokenfield:createdtoken', function (event) {
        //console.log("Add token", event);
        // Add tags to index if no _id
        if (ImageTags.find({value: event.attrs.value}).count() <= 0) {
            console.log("Add to database")
            ImageTags.insert({
                value: event.attrs.value
            });
        }

        // Add tag to instrument
        saveTags($(this).tokenfield('getTokens'));
    });

    elem.on('tokenfield:removedtoken', function (event) {
        //console.log("Removed token", event);

        // Add tag to instrument
        saveTags($(this).tokenfield('getTokens'));
    });

});

Template.tagInput.helpers({

    myTags: function() {
        return (this.tags || []).join(",");
    }

});
