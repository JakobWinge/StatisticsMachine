/**
 * Created by jeppestougaard on 16/11/15.
 */

var chart;
var countableProperties = [
    {
        name: "Class distribution",
        groupBy: "class"
    },
    {
        name: "Rating distribution",
        groupBy: "rating"
    },
    {
        name: "Number of mis-connections",
        groupBy: "misconnections"
    },
    {
        name: "Number of sensors",
        groupBy: function(item) {
            // Count number of sensors on item
            return _.reduce(item.sensors, function(memo, sensorName) {
                return memo + (sensorName ? 1 : 0);
            }, 0)
        }
    },
    {
        name: "Has sound wheel",
        groupBy: function(item) {
            return item.soundselector ? "YES" : "NO";
        }
    },
    {
        name: "Has button",
        groupBy: function(item) {
            return _.contains(item.sensors, "Button") ? "YES" : "NO";
        }
    },
    {
        name: "Has color",
        groupBy: function(item) {
            return _.contains(item.sensors, "Color") ? "YES" : "NO";
        }
    },
    {
        name: "Has gyro",
        groupBy: function(item) {
            return _.contains(item.sensors, "Gyro") ? "YES" : "NO";
        }
    },
    {
        name: "Has IR",
        groupBy: function(item) {
            return _.contains(item.sensors, "IR") ? "YES" : "NO";
        }
    },
    {
        name: "Has Ultra-Sonic",
        groupBy: function(item) {
            return _.contains(item.sensors, "UltraSonic") ? "YES" : "NO";
        }
    }
];
var undefinedLabel = "Not set";

function getChartData() {
    var images = Images.find({state:"instrument"}).fetch();

    var groupBy = getCountProperty().groupBy;

    return _.map(_.countBy(images, function(item) {
        if (_.isString(groupBy)) {
            return (typeof item[groupBy] == "undefined" || item[groupBy] === null) ? undefinedLabel : item[groupBy];
        } else if (_.isFunction(groupBy)) {
            return groupBy(item);
        }
    }), function(num, key) {
        return {
            y: num,
            name: key
        };
    });
}

function getCountProperty() {
    var index = Session.get("countProperty") || 0;
    return countableProperties[index];
}

function getChartTitle() {
    return getCountProperty().name.toUpperCase();
}

function builtChart() {

    console.log("Data", getChartData(), getCountProperty().name);

    chart = $('#distribution_chart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: getChartTitle()
        },
        tooltip: {
            pointFormat: '<b>{point.y} ({point.percentage:.1f}%)</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<i>{point.name}</i>: {point.y}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Instruments per class',
            data: getChartData()
        }]
    });
}

/*
 * Call the function to built the chart when the template is rendered
 */
Template.statistics.onRendered(function () {
    Tracker.autorun(function () {
        builtChart();
    });
});

/*
 * Template events
 */
Template.statistics.events = {

    'change #distribution_type': function (event) {

        var newValue = $(event.target).val();
        Session.set('countProperty', newValue);
    }
};

Template.statistics.helpers({

    "countableProperties": function() {
        return countableProperties;
    },

    "countablePropertyChecked": function() {
        if (this.name === getCountProperty().name) {
            return "selected";
        }
    }
});