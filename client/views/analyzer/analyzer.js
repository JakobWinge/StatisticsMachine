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
        if (Session.get("state") === "instrument" || Session.get("state") === "picture") {
            if(Session.get("state") === "picture" && Session.get("instrumentForRef") !== "") {
                console.log("inside!");
                var record = Images.findOne({_id : this._id});
                if (record.ref.constructor !== Array) {
                    var ref = [];
                    ref.push(Session.get("instrumentForRef"));
                    Images.update(this._id, {
                        $set: {'ref': ref}
                    });
                } else {
                    var record = Images.findOne({_id : this._id}).ref;
                    record.push(Session.get("instrumentForRef"));
                    Images.update(this._id, {
                        $set: {'ref': record}
                    });
                }
            }
            Images.update(this._id, {
                $set: {'state': Session.get("state")}
            });
            Session.set("state", "");
            Session.set("instrumentForRef", "");
        }
        window.scrollTo(0, 0);
    }
});

var setState = function(self, type) {
    if(Router.current().params._id !== "default") {
        Images.update(self._id, {
            $set: {'state': type}
        });
    }
}