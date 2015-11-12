var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.analyzer.helpers({

    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    },

    instrument: function() {
return Session.get("state");
    }
});
Template.analyzer.events({
    "click .cb-enable": function () {
        console.log("clicked!", event.target);
        $(event.target).parent().addClass("selected");
        var fieldswitch = $(event.target).parents('.switch');
        console.log("switch: ", fieldswitch);
        var disabled = $(fieldswitch).children('.cb-disable');
        console.log(disabled);
        $(disabled).removeClass('selected');
        Session.set("state", "instrument");
    },

    "click .cb-disable": function () {
        console.log("clicked!", event.target);
        $(event.target).parent().addClass("selected");
        var fieldswitch = $(event.target).parents('.switch');
        console.log("switch: ", fieldswitch);
        var disabled = $(fieldswitch).children('.cb-enable');
        console.log(disabled);
        $(disabled).removeClass('selected');
        Session.set("state", "picture");
    }
});
