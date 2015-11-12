var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";


Template.analyzer.helpers({

    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    },

    instrument: function () {
        console.log("is state set?" , Session.get("state"));
        return Session.get("state");
    },
    isStateSet : function() {
        console.log("route", Router.current().params._id);
        if(Router.current().params._id !== "default") {
            return false
        }
        if(Session.get("state") === "instrument" || Session.get("state") === "picture") {
            return true;
        } else {
            return false;
        }
    },
    getState : function(type) {
        console.log("stateobject", this);
        if(Router.current().params._id === "default") {
            if (type === Session.get("state")) {
                return "active"
            }
        } else{
            if (type === this.state) {
                return "active"
            }
        }
    }
});
Template.analyzer.events({

    "click #instrumentState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('pictureState').removeClass("active");
        Session.set("state", "instrument");
        setState(this,  "instrument");
    },
    "click #pictureState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('instrumentState').removeClass("active");
        Session.set("state", "picture");
        setState(this, "picture");
    },
    "click #saveState": function () {
        console.log("state", Session.get("state"));
        if (Session.get("state") === "instrument" || Session.get("state") === "picture") {
            Images.update(this._id, {
                $set: {'state': Session.get("state")}
            });
            Session.set("state", "");
        }
        window.scrollTo(0, 0);
    }
});

var setState = function(self, type) {
    if(Router.current().params._id !== "default") {
        console.log("Not default!");
        Images.update(self._id, {
            $set: {'state': type}
        });
    }
}