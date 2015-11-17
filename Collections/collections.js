Images = new Meteor.Collection("images");
SchoolClasses = new Meteor.Collection("school_classes");
Sensors = new Meteor.Collection("sensors");
ImageTags = new Meteor.Collection("image_tags");
Charts = new Meteor.Collection("charts");

function fooSearch(arg1) {
    console.log("fooSearch", arg1);
    return {bar: arg1};
}