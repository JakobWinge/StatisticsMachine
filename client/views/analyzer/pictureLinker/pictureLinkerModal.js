var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureLinkerModal.helpers({
    pictures: function () {
        console.log("this", this.picture.class);
        return Images.find({'class': this.picture.class, 'state': 'instrument'})
    },

    instrumentRefs: function () {
        console.log("find: ", this.picture.refs);

        return Images.find({_id: {$in: this.picture.refs || []}})

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
    },

    "click .instrumentRefOptionsEdit" : function(event) {
        $('#pictureRefModal').on('hidden.bs.modal', function () {
            Router.go("analyzer", {_id : id});
        });
        $('#pictureRefModal').modal('hide');
        event.preventDefault();
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