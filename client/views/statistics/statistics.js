/**
 * Created by jeppestougaard on 16/11/15.
 */

function getFilter() {
    return Session.get("filterObject") || {state:"instrument"};
}

Template.statistics.events = {
    "click #addPieChart": function (event, template) {
        console.log("New pie chart")

        Charts.insert({
            type: "piechart"
        });
    },

    "click #addBarChart": function (event, template) {
        console.log("New bar chart")

        Charts.insert({
            type: "barchart"
        });
    },


    "click .btn-close-panel": function(event, template) {
        var id = $(event.currentTarget).data("chartid");
        console.log("Close btn pressed", id);

        Charts.remove(id);
    }
};

Template.statistics.helpers({
    charts: function() {
        return Charts.find();
    },

    setSize: function() {
        return Images.find(getFilter()).count();
    }
});


function getChartColors() {
    var colors = [],
        base = "#eb6864", //Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}

Highcharts.getOptions().plotOptions.pie.colors = getChartColors();
//Highcharts.getOptions().colors = getChartColors();