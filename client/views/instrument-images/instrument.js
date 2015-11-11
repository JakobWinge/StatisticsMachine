var localhost = false;
var imageServer;

if (!localhost) {
    imageServer = "http://10.192.112.71:8080/";
} else {
    imageServer = "http://127.0.0.1:8080/";
}

Template.instrument.events({
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

Template.instrument.onRendered(function() {
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
});

Template.instrument.helpers({

    schoolClasses: function () {
        return SchoolClasses.find({});
    },

    sensors: function () {
        return Sensors.find({});
    },

    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
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

    soundSelectorChecked: function(soundselector) {
        if(soundselector) return "checked";
    }

});
