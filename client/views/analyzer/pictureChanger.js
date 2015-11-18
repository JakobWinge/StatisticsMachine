var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureChanger.events({
    'keyup #inputComment': function(event) {
        var x = event.target.value;
        Images.update(this._id, {
            $set: {'comment': x}
        });
    },

    "click .instrumentRefOptionsDelete" : function() {
        var refs = Template.parentData(1).refs || [];
        console.log("refs", refs);
        console.log("looking for", this._id);
        var index = $.inArray(this._id, refs);

        if (index !== -1) {
            refs.splice(index, 1);
            Images.update(Template.parentData(1)._id, {
                $set: {'refs': refs}
            });
        }
    }
});

Template.pictureChanger.helpers({
    instrumentRefs: function () {
        console.log("find: ", this.refs);

        return Images.find({_id: {$in: this.refs || []}})

    }
})