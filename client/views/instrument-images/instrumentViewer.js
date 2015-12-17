Template.instrumentViewer.helpers({
    relatedPictures : function() {
        return Images.find({'refs' : this._id, 'state' : "picture"});
    },
    relatedPicturesCount: function() {
        return Images.count({'refs' : this._id, 'state' : "picture"});
    }
});