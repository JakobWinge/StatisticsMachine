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
    },
    isDefault : function() {
        console.log("route", Router.current().params._id);
        if(Router.current().params._id !== "default") {
            return false
        }
        return true;
    },
    setState : function(type) {
        console.log("stateobject", this);
        if (type === this.state) {
            return "active"
        }
    }
});
Template.analyzer.events({

    "click #instrumentState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('pictureState').removeClass("active");
        Session.set("state", "instrument");
        console.log("state", Session.get("state"));
        setState(this,  "instrument");
        $('#remember').hide(500);
    },
    "click #pictureState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('instrumentState').removeClass("active");
        Session.set("state", "picture");
        console.log("state", Session.get("state"));
        setState(this, "picture");
        $('#remember').hide(500);
    },
    "click #saveState": function () {
        console.log("state", Session.get("state"));
        if (Session.get("state") === "instrument" || Session.get("state") === "picture") {
            Images.update(this._id, {
                $set: {'state': Session.get("state")}
            });
            Session.set("state", "");
            $('#remember').hide(500);
        } else {
            $('#remember').show(500);
        }
    }
});

Template.analyzer.onRendered(function () {
    $('#remember').hide();
});

var setState = function(self, type) {
    if(Router.current().params._id !== "default") {
        console.log("Not default!");
        Images.update(self._id, {
            $set: {'state': type}
        });
    }
}