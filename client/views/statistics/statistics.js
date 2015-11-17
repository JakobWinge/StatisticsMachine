/**
 * Created by jeppestougaard on 16/11/15.
 */

Template.statistics.events = {
    "click #addChart": function (event, template) {
        console.log("New chart")

        Charts.insert({
            type: "piechart"
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
    }
});