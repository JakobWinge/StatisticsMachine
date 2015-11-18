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

    if (this.data.rating === null) {
        console.log("updating rating", this);
        Images.update(this.data._id, {$set: {rating : 0}})
    }

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

    picturesOfInstruments : function() {
      return Images.find({refs : this.id})
    },

    soundSelectorChecked: function(soundselector) {
        if(soundselector) return "checked";
    }

});
