var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureLinkerModal.helpers({
    instrument: function () {
        return Images.find({'class': this.instrument.class, 'state': 'instrument'})
    },

    instrumentRefs: function () {
        console.log("find: ", this.instrument.refs);

        return Images.find({_id: {$in: this.instrument.refs || []}})

    },
    original: function () {
        return imageServer + "originals/";
    },

    resized: function () {
        return imageServer + "resized/";
    },
    chosenRef: function () {
        return Session.get("instrumentForRef");
    }
});

Template.pictureLinkerModal.events({

    "click .setRef": function () {

        var refs = Template.parentData(1).refs || [];
        if ($.inArray(this._id, refs) === -1) {
            refs.push(this._id);
            Images.update(Template.parentData(1)._id, {
                $set: {'refs': refs}
            });
        }

        console.log("this", this);
        console.log("parent this", Template.parentData(1));
    }
});