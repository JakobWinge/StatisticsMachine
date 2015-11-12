var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";


Template.analyzer.helpers({

    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    },

    instrument: function () {
        return Session.get("state");
    }
});
Template.analyzer.events({

    "click #instrumentState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('pictureState').removeClass("active");
        Session.set("state", "instrument");
        $('#remember').hide(500);
    },
    "click #pictureState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('instrumentState').removeClass("active");
        Session.set("state", "picture");
        $('#remember').hide(500);
    },
    "click #saveState": function () {
        if (Session.get("state") === "instrument" || Session.get("state") === "picture") {


            Images.update(this._id, {
                $set: {'state': Session.get("state")}
            });
            $('#remember').hide(500);
            Session.set('state', "");
        } else {
            $('#remember').show(500);
        }
    }
});

Template.analyzer.onRendered(function () {
    $('#remember').hide();
});
