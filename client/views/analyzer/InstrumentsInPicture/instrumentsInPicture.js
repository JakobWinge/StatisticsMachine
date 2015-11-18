Template.InstrumentsInPicture.events({
    "click .instrumentRefOptionsDelete": function () {
        var refs = Template.parentData(1).refs || [];
        console.log("this", this);
        console.log("looking for", Template.parentData(1)._id);
        var index = $.inArray(this._id, refs);

        if (index !== -1) {
            refs.splice(index, 1);
            Images.update(Template.parentData(1)._id, {
                $set: {'refs': refs}
            });
        }

    }


});

Template.InstrumentsInPicture.helpers({

    instrumentRefs: function () {
        console.log("find: ", this.picture.refs);

        return Images.find({_id: {$in: this.picture.refs || []}})

    },
    test : function(self) {
        console.log(self);
    },

    pictureData : function() {
        console.log("pictureData", this);
        return this.picture;
    }
});