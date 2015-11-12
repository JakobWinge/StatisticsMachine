Template.instrumentChanger.events({
    "change #inputClass": function () {
        // Set the checked property to the opposite of its current value
        Images.update(this._id, {
            $set: {class: event.target.value}
        });
    },

    "change #inputSensorPort1": function () {
        // Set the checked property to the opposite of its current value
        Images.update(this._id, {
            $set: {'sensors.port1' : event.target.value}
        });
    },

    "change #inputSensorPort2": function () {
        // Set the checked property to the opposite of its current value
        Images.update(this._id, {
            $set: {'sensors.port2': event.target.value}
        });
    },

    "change #inputSensorPort3": function () {
        // Set the checked property to the opposite of its current value
        Images.update(this._id, {
            $set: {'sensors.port3': event.target.value}
        });
    },

    "change #inputSensorPort4": function () {
        // Set the checked property to the opposite of its current value
        Images.update(this._id, {
            $set: {'sensors.port4': event.target.value}
        });
    },

    'click #soundSelector': function(event) {
        var x = $(event.target).is(":checked");
        console.log(x);
        Images.update(this._id, {
            $set: {'soundselector': x}
        });
    },

    'click #inputMisconnections': function(event) {
        var x = event.target.value;
        Images.update(this._id, {
            $set: {'misconnections': parseInt(x)}
        });
    },
    'keyup #inputComment': function(event) {
        var x = event.target.value;
        Images.update(this._id, {
            $set: {'comment': x}
        });
    }

});

Template.instrumentChanger.onRendered(function() {
    var self = this;
    $(this.find('.rating-slider')).slider().on('slideStop', function(ev) {
        Images.update(self.data._id, {
            $set: {rating: ev.value}
        });
    });

    Images.find({_id :  this.data._id}).observeChanges({
        changed: function(ev, obj) {
            if(obj.hasOwnProperty('rating')) {
                $(self.find('.rating-slider')).slider('setValue', obj.rating);
                console.log(obj.rating);
            }
        }
    });

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

Template.instrumentChanger.helpers({

    schoolClasses: function () {
        return SchoolClasses.find({});
    },

    sensors: function () {
        return Sensors.find({});
    },
    inputClassChecked: function (db) {
        if (this.value === db) {
            return "selected";
        }
    },
    portChecked: function (db) {
        if (this.value === db) {
            return "selected";
        }
    },

    myTags: function() {
        return (this.tags || []).join(",");
    },

    soundSelectorChecked: function(soundselector) {
        if(soundselector) return "checked";
    }

});
