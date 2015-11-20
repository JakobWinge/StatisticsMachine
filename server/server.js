

if (Meteor.isServer) {
    Meteor.startup(function () {
        SchoolClasses.remove({});
        if (SchoolClasses.find().count() === 0) {
            var optionsValue = ["K1", "K2", "K3", "P1A", "P1B","P2", "P3", "P4", "P5", "M678"];

            optionsValue.forEach( function(entry) {
                SchoolClasses.insert({
                    value: entry
                });
            })
        }

        Sensors.remove({});
        if (Sensors.find().count() === 0) {
            var sensors = ["Button", "Color", "IR", "UltraSonic", "Gyro"];
            sensors.forEach( function(entry) {
                Sensors.insert({
                    value: entry
                });
            })
        }
    });

    Meteor.methods({
        'scanFiles': function () {

            var url = "http://127.0.0.1:8080/analyze";
            var result = Meteor.http.get(url, {timeout:30000});
            if(result.statusCode==200) {
                var respJson = JSON.parse(result.content);
                console.log("response received.");
                console.log(respJson);
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        },
        'resetdatabase' : function() {
            Images.remove({})
        }
    });
}