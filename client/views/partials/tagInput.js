Template.tagInput.onRendered(function() {
    var self = this;

    $(this.find('.tags-input')).tokenfield({
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
        Images.update(self.data._id, {
            $set: {tags: tags}
        });
        self.data.tags = tags;
    }

    // Avoid duplicates
    $(this.find('.tags-input')).on('tokenfield:createtoken', function (event) {
        if (self.data.tags && self.data.tags.indexOf(event.attrs.value) > -1) {
            event.preventDefault();
        }
    });

    $(this.find('.tags-input')).on('tokenfield:createdtoken', function (event) {
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

    $(this.find('.tags-input')).on('tokenfield:removedtoken', function (event) {
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
