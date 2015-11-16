Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('ternary', function (condition, ifTrue, ifFalse) {
    return condition ? ifTrue : ifFalse;
});

var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.registerHelper('originalImagePath', function (image) {
    return imageServer + "originals/" + image;
});

Template.registerHelper('resizedImagePath', function (image) {
    return imageServer + "resized/" + image;
});