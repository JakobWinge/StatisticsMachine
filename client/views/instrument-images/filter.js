var getSensorConditions = function (sensorName) {
    return {
        $or: [{"sensors.port1": sensorName}, {"sensors.port2": sensorName}, {"sensors.port3": sensorName}, {"sensors.port4": sensorName}]
    };
};

Template.filter.onRendered(function() {
   Tracker.autorun(function() {
      // Set filter object

       var schoolClass = Session.get("filterInputClass");
       var instrumentRating = Session.get("filterInputInstrumentRating");
       var decorationRating = Session.get("filterInputDecorationRating");
       var Button = Session.get("sensorButton");
       var Color = Session.get("sensorColor");
       var IR = Session.get("sensorIR");
       var UltraSonic = Session.get("sensorUltraSonic");
       var Gyro = Session.get("sensorGyro");
       var p1 = Session.get("port1");
       var p2 = Session.get("port2");
       var p3 = Session.get("port3");
       var p4 = Session.get("port4");
       var soundselector = Session.get("soundselector");
       var inputMisconnections = Session.get("inputMisconnections");
       var comment = Session.get("instrumentFilterComment");

       var conditions = [];

       if (schoolClass !== "" && typeof schoolClass !== "undefined") {
           conditions.push({"class": schoolClass});
       }
       if (instrumentRating !== "" && instrumentRating !== undefined) {
           conditions.push({'instrumentRating': parseInt(instrumentRating)});
       }
       if (decorationRating !== "" && decorationRating !== undefined) {
           conditions.push({'decorationRating': parseInt(decorationRating)});
       }
       if (p1) {
           conditions.push({'sensors.port1': {$nin: [null, ""]}});
       }
       if (p2) {
           conditions.push({'sensors.port2': {$nin: [null, ""]}});
       }
       if (p3) {
           conditions.push({'sensors.port3': {$nin: [null, ""]}});
       }
       if (p4) {
           conditions.push({'sensors.port4': {$nin: [null, ""]}});
       }

       if (soundselector === true) {
           conditions.push({'soundselector': true});
       }
       if (inputMisconnections > 0) {
           conditions.push({'misconnections': {$gt: parseInt(inputMisconnections)}});
       }
       if (comment) {
           conditions.push({comment: {
               $regex: '.*' + comment + '.*',
               $options: "i"
           }});
       }

       //sensors
       if (Button === true) {
           conditions.push(getSensorConditions("Button"));
       }

       if (Color === true) {
           conditions.push(getSensorConditions("Color"));
       }

       if (IR === true) {
           conditions.push(getSensorConditions("IR"));
       }

       if (UltraSonic === true) {
           conditions.push(getSensorConditions("UltraSonic"));
       }

       if (Gyro === true) {
           conditions.push(getSensorConditions("Gyro"));
       }

       conditions.push({state: "instrument"});

       var filterObject = conditions.length > 0 ? {$and: conditions} : {};

       Session.set("filterObject", filterObject);

   });
});

Template.filter.helpers({
    schoolClasses: function () {
        return SchoolClasses.find({});
    },
    sensors: function () {
        return Sensors.find({});
    },
    filterClassChecked: function () {
        if ((!this.value && !Session.get('filterInputClass')) || this.value === Session.get('filterInputClass')) {
            return "selected";
        }
    },
    filterInstrumentRatingChecked: function() {
        if ((!Session.get('filterInputInstrumentRating')) && !_.isNumber(this) || this == Session.get('filterInputInstrumentRating')) {
            return "selected";
        }
    },
    filterDecorationRatingChecked: function() {
        if ((!Session.get('filterInputDecorationRating')) && !_.isNumber(this) || this == Session.get('filterInputDecorationRating')) {
            return "selected";
        }
    },
    filterSensorChecked: function(sensorName) {
        if (Session.get("sensor"+sensorName)) {
            return "checked";
        }
    },
    filterPortChecked: function(portNumber) {
        if (Session.get("port"+portNumber)) {
            return "checked";
        }
    },
    filterSoundSelectorChecked: function() {
        if (Session.get("soundselector")) {
            return "checked";
        }
    },

    filterMisconnectionsValue: function() {
        return Session.get("inputMisconnections");
    },
    filterCommentValue: function() {
        return Session.get("instrumentFilterComment");
    },


});

Template.filter.events(
    {
        "change #filterInputClass": function (event) {
            Session.set("filterInputClass", event.target.value);
        },
        "change #filterInputInstrumentRating": function (event) {
            Session.set("filterInputInstrumentRating", event.target.value);
        },
        "change #filterInputDecorationRating": function (event) {
            Session.set("filterInputDecorationRating", event.target.value);
        },
        "change #sensorButton": function (event) {
            Session.set("sensorButton", event.target.checked);
        },
        "change #sensorColor": function (event) {
            Session.set("sensorColor", event.target.checked);
        },
        "change #sensorIR": function (event) {
            Session.set("sensorIR", event.target.checked);
        },
        "change #sensorUltraSonic": function (event) {
            Session.set("sensorUltraSonic", event.target.checked);
        },
        "change #sensorGyro": function (event) {
            Session.set("sensorGyro", event.target.checked);
        },
        "change #port1": function (event) {
            Session.set("port1", event.target.checked);
        },
        "change #port2": function (event) {
            Session.set("port2", event.target.checked);
        },
        "change #port3": function (event) {
            Session.set("port3", event.target.checked);
        },
        "change #port4": function (event) {
            Session.set("port4", event.target.checked);
        },
        "change #soundselector": function (event) {
            Session.set("soundselector", event.target.checked);
        },
        "change #inputMisconnections": function (event) {
            Session.set("inputMisconnections", event.target.value);
        },
        "change #filterComment": function (event) {
            Session.set("instrumentFilterComment", event.target.value);
        }
    }
);