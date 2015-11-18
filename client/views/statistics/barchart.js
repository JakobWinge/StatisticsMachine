/**
 * Created by jeppestougaard on 17/11/15.
 */

 var ports = ["PORT1", "PORT2", "PORT3", "PORT4"];

function getFilter() {
    return Session.get("filterObject") || {state:"instrument"};
}

function getChartData() {
    var instruments = Images.find(getFilter()).fetch();

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
}

/*
 * Function to draw the column chart
 */
function builtColumnChart() {
    $(this.find('.chart')).highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Instrument sensors'
        },

        subtitle: {
            text: ''
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: ports
        },

        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: 'Number connected'
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
                pointPadding: 0.2,
                borderWidth: 0
            }
        },

        series: getChartData()
    });
}

/*
 * Call the function to built the chart when the template is rendered
 */
Template.barchart.onRendered(function() {
    var self = this;

    Tracker.autorun(function() {
        builtColumnChart.call(self);
    });
});