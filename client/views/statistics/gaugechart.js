/**
 * Created by jeppestougaard on 17/11/15.
 */

var getAvg = function(array, itemValueCallback) {
    return _.reduce(array, function(memo, item) {
            return memo + itemValueCallback(item);
        }, 0) / (array.length === 0 ? 1 : array.length);
};

var chartTypes = {
    total: {
        title: "Number of instruments",
        getChartValue: function (instruments) {
            return instruments.length;
        },
        getMaxValue: function(instruments) {
            return 100; // TODO
        }
    },
    avgInstrumentRating: {
        title: "Avg intrument rating",
        getChartValue: function (instruments) {
            return getAvg(instruments, function(item) {return item.instrumentRating});
        },
        getMaxValue: function() {
            return 5;
        },
        isDecimal: true
    },
    avgDecorationRating: {
        title: "Avg decoration rating",
        getChartValue: function (instruments) {
            return getAvg(instruments, function(item) {return item.decorationRating});
        },
        getMaxValue: function() {
            return 5;
        },
        isDecimal: true
    },
    avgSensorsUsed: {
        title: "Avg sensors used",
        getChartValue: function (instruments) {
            return getAvg(instruments, function(item) {
                return _.reduce(item.sensors, function(memo, sensorName) {
                    return memo + (sensorName ? 1 : 0);
                }, 0);
            });
        },
        getMaxValue: function() {
            return 4;
        },
        isDecimal: true
    },
    classes: {
        title: "Classes represented",
        getChartValue: function (instruments) {
            return _.size(_.groupBy(instruments, function(item) {return item.class}));
        },
        getMaxValue: function(instruments) {
            return 10; // TODO
        }
    },
    usingPort1: {
        title: "Using port 1",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return item.sensors.port1 ? "YES" : "NO"}).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingPort2: {
        title: "Using port 2",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return item.sensors.port2 ? "YES" : "NO"}).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingPort3: {
        title: "Using port 3",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return item.sensors.port3 ? "YES" : "NO"}).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingPort4: {
        title: "Using port 4",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return item.sensors.port4 ? "YES" : "NO"}).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingButton: {
        title: "Using button",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "Button") ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingIR: {
        title: "Using IR sensor",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "IR") ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingUltra: {
        title: "Using ultra-sonic sensor",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "UltraSonic") ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingGyro: {
        title: "Using gyro",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "Gyro") ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingColor: {
        title: "Using color sensor",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "Color") ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    },
    usingDistance: {
        title: "Using some distance sensor",
        getChartValue: function (instruments) {
            return _.countBy(instruments, function(item) {return (_.contains(item.sensors, "IR") || _.contains(item.sensors, "UltraSonic")  ? "YES" : "NO") }).YES || 0;
        },
        getMaxValue: function(instruments) {
            return instruments.length;
        }
    }


};
var undefinedLabel = "Not set";
function getFilter() {
    return Session.get("filterObject") || {state:"instrument"};
}



Template.gaugechart.onCreated(function() {

    this.chart = null;

    this.getChartType = function() {
        return this.data.chartHandler || "total";
    };

    this.builtChart = function() {

        var instruments = Images.find(getFilter()).fetch();
        var chartHandler = chartTypes[this.getChartType()];

        this.chart = $(this.find('.chart')).highcharts({
            chart: {
                type: 'solidgauge'
            },
            title: {
                text: chartHandler.title.toUpperCase()
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            yAxis: {
                min: 0,
                max: chartHandler.getMaxValue(instruments),
                stops: [
                    [0, '#eb6864']
                ],
                lineWidth: 0,
                tickPixelInterval: null,
                minorTickInterval: null,
                tickWidth: 0,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            series: [{
                name: chartHandler.title,
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:#7e7e7e">'+(chartHandler.isDecimal ? '{y:.1f}' : '{y}')+'</span>'
                },
                data: [chartHandler.getChartValue(instruments)]

            }]
        });

    };
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.gaugechart.onRendered(function () {
    var self = this;

    Charts.find(this.data._id).observeChanges({
        changed: function(ev, changes) {
            if (changes.hasOwnProperty("chartHandler")) {
                self.data.chartHandler = changes.chartHandler;
                self.builtChart();
            }
        }
    });

    Tracker.autorun(function() {
        //console.log("Tracker autorun", Session.get("filterObject"));
        self.builtChart();
    });
});

/*
 * Template events
 */
Template.gaugechart.events = {

    "change .property-selector": function (event, template) {
        var newValue = $(event.target).val();
        Charts.update(template.data._id, {$set: {chartHandler: newValue}});
    }
};

Template.gaugechart.helpers({

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

    "chartId": function() {
        return Template.instance().data._id;
    }
});
