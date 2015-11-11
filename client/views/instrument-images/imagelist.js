var ITEMS_INCREMENT = 5;
Session.setDefault('itemsLimit', ITEMS_INCREMENT);

Template.imagelist.helpers({
    moreResults : function() {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(Images.find(Session.get("findObject")).count() < Session.get("itemsLimit"));
    },

    images: function () {
        var schoolClass = Session.get("filterInputClass");
        var rating = Session.get("filterInputRating");
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
        var comment = Session.get("comment");

        var findObject = {};

        if(schoolClass !== "" && schoolClass !== undefined){
            findObject.class = schoolClass;
        }
        if(rating !== "" && rating !== undefined){
            findObject.rating = parseInt(rating);
        }
        if(p1) findObject['sensors.port1'] = {$nin:[null, ""]};
        if(p2) findObject['sensors.port2'] = {$nin:[null, ""]};
        if(p3) findObject['sensors.port3'] = {$nin:[null, ""]};
        if(p4) findObject['sensors.port4'] = {$nin:[null, ""]};

        if(soundselector === true)findObject.soundselector = true;
        console.log(inputMisconnections);
        if(inputMisconnections > 0)findObject.misconnections = { $gt: parseInt(inputMisconnections) };
        if(comment === true)findObject.comment = {$ne:null};

        if(Button === true) {
            findObject = packSelectors("Button", findObject);
        }

        if(Color === true) {
            findObject = packSelectors("Color", findObject);
        }

        if(IR === true) {
            findObject = packSelectors("IR", findObject);
        }

        if(UltraSonic === true) {
            findObject = packSelectors("UltraSonic", findObject);
        }

        if(Gyro === true) {
            findObject = packSelectors("Gyro", findObject);
        }

        Session.set("findObject", findObject);

        return Images.find(findObject, {limit:Session.get('itemsLimit')});
    }
});

var packSelectors = function(sensor, findObject) {
        var findObject1 = jQuery.extend({},findObject);
        var findObject2 = jQuery.extend({},findObject);
        var findObject3 = jQuery.extend({},findObject);
        var findObject4 = jQuery.extend({},findObject);
        findObject1['sensors.port1'] = sensor;
        findObject2['sensors.port2'] = sensor;
        findObject3['sensors.port3'] = sensor;
        findObject4['sensors.port4'] = sensor;
        return { $or: [ findObject1, findObject2, findObject3, findObject4] };
};

function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    if (!target.length){
        return;
    };

    threshold = $(window).scrollTop() + $(window).height() - target.height()+150;

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