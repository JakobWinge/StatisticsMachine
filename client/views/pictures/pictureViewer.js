/**
 * Created by jeppestougaard on 10/12/15.
 */


Template.pictureViewer.events = {
    'keydown #newComment': function(event) {
        //console.log("New comment", event, Template.instance());
        if (event.keyCode == 13 && !event.shiftKey) {
            // Enter clicked
            event.preventDefault();

            var newComment = event.target.value;

            var comments = Template.instance().data.comments || [];

            comments.push({
                user: Meteor.user() ? Meteor.user().username : "Anonymous",
                date: new Date(),
                comment: newComment
            });

            Images.update(this._id, {
                $set: {'comments': comments}
            });
            console.log("Create comment", newComment, comments);

            event.target.value = "";

            return false;
        }
        return true;
    }
};


Template.pictureViewer.helpers({
    myComments: function() {
        return this.comments || [];
    }
})