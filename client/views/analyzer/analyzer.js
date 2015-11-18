var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";


Template.analyzer.helpers({

    instrument: function () {
        return Session.get("state");
    },
    getState : function(type) {
        if(Router.current().params._id === "default") {
            if (type === Session.get("state")) {
                return "active"
            }
        } else{
            if (type === this.state) {
                return "active"
            }
        }
    },
    instrumentRefs: function () {
        console.log("find: ", this.refs);

        return Images.find({_id: {$in: this.refs || []}})

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
    }
});

var setState = function(self, type) {
    if(Router.current().params._id !== "default") {
        Images.update(self._id, {
            $set: {'state': type}
        });
    }
}