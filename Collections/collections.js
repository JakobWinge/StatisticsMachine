Images = new Meteor.Collection("images");
SchoolClasses = new Meteor.Collection("school_classes");
Sensors = new Meteor.Collection("sensors");

function fooSearch(arg1) {
    console.log("fooSearch", arg1);
    return {bar: arg1};
}