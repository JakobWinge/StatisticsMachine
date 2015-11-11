Template.filter.helpers({
    schoolClasses: function () {
        return SchoolClasses.find({});
    },
    sensors: function () {
        return Sensors.find({});
    }

});

Template.filter.events(
    {
        "change #filterInputClass": function (event) {
            Session.set("filterInputClass", event.target.value);
            console.log(event.target.value);
        },
        "change #filterInputRating": function (event) {
            Session.set("filterInputRating", event.target.value);
            console.log(event.target.value);
        },
        "change #sensorButton": function (event) {
            Session.set("sensorButton", event.target.checked);
            console.log(event.target.checked);
        },
        "change #sensorColor": function (event) {
            Session.set("sensorColor", event.target.checked);
            console.log(event.target.checked);
        },
        "change #sensorIR": function (event) {
            Session.set("sensorIR", event.target.checked);
            console.log(event.target.checked);
        },
        "change #sensorUltraSonic": function (event) {
            Session.set("sensorUltraSonic", event.target.checked);
            console.log(event.target.checked);
        },
        "change #sensorGyro": function (event) {
            Session.set("sensorGyro", event.target.checked);
            console.log(event.target.checked);
        },
        "change #port1": function (event) {
            Session.set("port1", event.target.checked);
            console.log(event.target.checked);
        },
        "change #port2": function (event) {
            Session.set("port2", event.target.checked);
            console.log(event.target.checked);
        },
        "change #port3": function (event) {
            Session.set("port3", event.target.checked);
            console.log(event.target.checked);
        },
        "change #port4": function (event) {
            Session.set("port4", event.target.checked);
            console.log(event.target.checked);
        },
        "change #soundselector": function (event) {
            Session.set("soundselector", event.target.checked);
            console.log(event.target.checked);
        },
        "change #inputMisconnections": function (event) {
            Session.set("inputMisconnections", event.target.value);
            console.log(event.target.checked);
        },
        "change #comment": function (event) {
            Session.set("comment", event.target.checked);
            console.log(event.target.checked);
        }
    }
);