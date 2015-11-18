var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.pictureLinkerModal.helpers({
    pictures: function () {
        var instrumentsFromClass =  Images.find({'class': this.picture.class, 'state': 'instrument'}).fetch();
        var filterArray = this.picture.refs;
        return _.filter(instrumentsFromClass, function(entry) {
            if ($.inArray(entry._id, filterArray) > -1){
                return false
            } else {
                return true;
            }
        })
    },

    instrumentRefs: function () {
        return Images.find({_id: {$in: this.picture.refs || []}})

    }
});

Template.pictureLinkerModal.events({

    "click .setRef": function () {
        console.log("images clicked", Template.parentData(1));

        var refs = Template.parentData(1).picture.refs || [];
        if ($.inArray(this._id, refs) === -1) {
            refs.push(this._id);
            Images.update(Template.parentData(1).picture._id, {
                $set: {'refs': refs}
            });
        }
    },

    "click .instrumentRefOptionsEdit" : function(event) {
        console.log("Edit!", this);
        var self = this;
        $('#pictureRefModal' + Template.parentData(1).picture._id).on('hidden.bs.modal', function () {
            Router.go("analyzer", {_id : self._id});
        });
        $('#pictureRefModal'  + Template.parentData(1).picture._id).modal('hide');
        event.preventDefault();
    },

    "click .instrumentRefOptionsDelete" : function() {
        var refs = Template.parentData(1).picture.refs || [];
        var index = $.inArray(this._id, refs);

        if (index !== -1) {
            refs.splice(index, 1);
            Images.update(Template.parentData(1).picture._id, {
                $set: {'refs': refs}
            });
        }
    }

});