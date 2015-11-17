/**
 * Created by jeppestougaard on 17/11/15.
 */
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




Template.piechart.onCreated(function() {
    console.log("Chart created", this, this.data._id);

    this.chart = null;

    this.getChartData = function() {
        var images = Images.find({state:"instrument"}).fetch();

        var groupBy = this.getCountProperty().groupBy;

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
    };

    this.getCountProperty = function() {
        var index = this.data.propertyType || 0;
        return countableProperties[index];
    };

    this.getChartTitle = function() {
        return this.getCountProperty().name.toUpperCase();
    };

    this.builtChart = function() {

        console.log("Data", this.getChartData(), this.getCountProperty().name);

        this.chart = $(this.find('.chart')).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: this.getChartTitle()
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
                data: this.getChartData()
            }]
        });
    };
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.piechart.onRendered(function () {
    console.log("Chart", this);
    //Tracker.autorun(this.builtChart.bind(this));
    var self = this;
    self.builtChart();
    Charts.find(this.data._id).observeChanges({
        changed: function(ev, changes) {
            console.log("Chart changed", changes);
            if (changes.hasOwnProperty("propertyType")) {
                self.data.propertyType = changes.propertyType;
                self.builtChart();
            }
        }
    });
});

/*
 * Template events
 */
Template.piechart.events = {

    "change .property-selector": function (event, template) {

        var newValue = $(event.target).val();
        console.log("Change chart", template.data._id, newValue);
        /*Session.set(template.sessionKeyName, newValue);*/
        Charts.update(template.data._id, {$set: {propertyType: parseInt(newValue, 10)}});
    }
};

Template.piechart.helpers({

    "countableProperties": function() {
        return countableProperties;
    },

    "countablePropertyChecked": function() {
        if (this.name === Template.instance().getCountProperty().name) {
            return "selected";
        }
    },

    "chartId": function() {
        return Template.instance().data._id;
    }
});
