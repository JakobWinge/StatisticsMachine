Template.picturesOfInstrument.helpers({
    pictureOfInstrument : function() {
        console.log("trying to locate images....", this);
        return Images.find({refs : this.picture._id, 'state' : 'picture'})
    }
});

Template.picturesOfInstrument.events({
    "click .instrumentRefOptionsDelete": function () {
        var refs = this.refs || [];
        console.log("this", this);
        console.log("looking for", Template.parentData(1)._id);
        var index = $.inArray(Template.parentData(1)._id, refs);

        if (index !== -1) {
            refs.splice(index, 1);
            Images.update(this._id, {
                $set: {'refs': refs}
            });
        }

    }


});