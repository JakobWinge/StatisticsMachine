/**
 * Created by jeppestougaard on 17/11/15.
 */

var ports = ["PORT1", "PORT2", "PORT3", "PORT4"];

function getBaseArray(size, baseValue) {
    if (typeof baseValue == "undefined") baseValue = 0;

    return _.range(size).map(function () { return baseValue; });
}

function getFilter() {
    return Session.get("filterObject") || {state:"instrument"};
}

function getClassNames() {
    return SchoolClasses.find().fetch().map(function(classObj) {
        return classObj.value;
    });
}

var chartTypes = {
    sensors: {
        title: "Instrument sensors",
        xAxisLabel: "Ports",
        getChartData: function(instruments) {

            var sensors = Sensors.find().fetch();
            var data = {
                Empty: [0,0,0,0]
            };
            _.each(sensors, function(sensor) {
                data[sensor.value] = [0,0,0,0];
            });


            _.each(instruments, function(instrument) {
                var portSensors = _.values(instrument.sensors);
                for (var i=0;i<portSensors.length;i++) {
                    var type = portSensors[i] ? portSensors[i] : "Empty";
                    if (!data[type]) data[type] = [0,0,0,0];
                    data[type][i]++;
                }
            });
            
            return _.values(_.map(data, function(data, key) {
                return {name: key, data: data};
            }));
        },
        getCategories: function() {
            return ports;
        }
    },
    ratingsPerClass: {
        title: "Ratings per class",
        xAxisLabel: "Class",
        getChartData: function(instruments) {

            var classes = getClassNames();
            var seriesSize = classes.length;
            var data = {
                Not_set: getBaseArray(seriesSize)
            };
            _.each(_.range(1, 6), function(ratingValue) {
                data[ratingValue] = getBaseArray(seriesSize);
            });


            _.each(instruments, function(instrument) {

                if (classes.indexOf(instrument.class) !== -1) {
                    var ratingValue = _.isNumber(instrument.rating) ? instrument.rating : "Not_set";
                    data[ratingValue][classes.indexOf(instrument.class)]++;
                }
            });

            return _.values(_.map(data, function(data, key) {
                return {name: key, data: data};
            }));
        },
        getCategories: function() {
            return getClassNames();
        }
    },
    classPerRating: {
        title: "Instruments per rating",
        xAxisLabel: "Rating",
        getChartData: function(instruments) {

            var classes = getClassNames();
            var categories = this.getCategories();
            var seriesSize = categories.length;

            var data = {};
            _.each(classes, function(className) {
                data[className] = getBaseArray(seriesSize);
            });


            _.each(instruments, function(instrument) {

                if (classes.indexOf(instrument.class) !== -1) {
                    var ratingValue = _.isNumber(instrument.rating) ? instrument.rating : "Not_set";
                    data[instrument.class][categories.indexOf(ratingValue)]++;
                }
            });

            return _.values(_.map(data, function(data, key) {
                return {name: key, data: data};
            }));
        },
        getCategories: function() {
            var categories = _.range(1, 6);
            categories.push("Not_set");
            return categories;
        }
    }
};


Template.barchart.onCreated(function() {
    //console.log("Chart created", this, this.data._id);

    this.chart = null;

    this.getChartType = function() {
        return this.data.chartHandler || "sensors";
    };

    this.builtColumnChart = function() {

        var instruments = Images.find(getFilter()).fetch();
        var chartHandler = chartTypes[this.getChartType()];

        $(this.find('.chart')).highcharts({

            chart: {
                type: 'column'
            },

            title: {
                text: chartHandler.title
            },

            subtitle: {
                text: ''
            },

            credits: {
                enabled: false
            },

            xAxis: {
                categories: chartHandler.getCategories(),
                title: {
                    text: chartHandler.xAxisLabel
                }
            },

            yAxis: {
                min: 0,
                allowDecimals: false,
                title: {
                    text: 'Amount'
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:1.2em;border-bottom: 1px solid black;">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },

            plotOptions: {
                column: {
                    /*stacking: 'normal',*/
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },

            series: chartHandler.getChartData(instruments)
        });
    };
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.barchart.onRendered(function() {
    var self = this;

    Charts.find(this.data._id).observeChanges({
        changed: function(ev, changes) {
            if (changes.hasOwnProperty("chartHandler")) {
                self.data.chartHandler = changes.chartHandler;
                self.builtColumnChart();
            }
        }
    });

    Tracker.autorun(function() {
        self.builtColumnChart();
    });
});

/*
 * Template events
 */
Template.barchart.events = {

    "change .property-selector": function (event, template) {
        var newValue = $(event.target).val();
        Charts.update(template.data._id, {$set: {chartHandler: newValue}});
    }
};

Template.barchart.helpers({
    chartTypes: function() {
        return _.map(chartTypes, function(handler, key) {
            return {key: key, name: handler.title};
        });
    },

    chartTypeChecked: function() {
        if (this.key === Template.instance().getChartType()) {
            return "selected";
        }
    },

    chartId: function() {
        return Template.instance().data._id;
    }
})