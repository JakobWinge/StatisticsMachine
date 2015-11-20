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

    },
    getLastRecord: function() {
        console.log("last page:", Session.get("lastAnalyzerRecord"));
        return Session.get("lastAnalyzerRecord");
    },
    isLastRecordAvailable: function() {
        return Session.get("lastAnalyzerRecord") || false;
    },
    isStateChosen: function() {
        console.log("state",Session.get("state") );
        return !!Session.get("state");
    },
    analyzedImages : function() {
        return Images.find({state : {$in : ["picture", "instrument", "skipState"]}}).count();
    },
    totalImages : function() {
        return Images.find({state : {$ne : "skipState"}}).count();
    },
    myTags: function() {
        return (this.tags || []).join(",");
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
    "click #skipState": function () {
        $(event.target).addClass("active");
        $(event.target).parent().children('instrumentState').removeClass("active");
        Session.set("state", "skipState");
        setState(this, "skipState");
    },

    "click .nextButton":function() {
            var arrayOfBacks = Session.get("lastAnalyzerRecord") || [];
            arrayOfBacks.push(this._id);
            Session.set("lastAnalyzerRecord", arrayOfBacks);
    },
    "click .backButton":function() {
        event.preventDefault();
        console.log("trying to go to : " + Session.get('lastAnalyzerRecord'));
        var arrayOfBacks = Session.get("lastAnalyzerRecord");
        var prevID = arrayOfBacks.pop();
        Session.set('lastAnalyzerRecord', arrayOfBacks);
        Router.go('analyzer', {_id: prevID});
    }
});

var setState = function(self, type) {
    if(Router.current().params._id !== "default") {
        Images.update(self._id, {
            $set: {'state': type}
        });
    }
}