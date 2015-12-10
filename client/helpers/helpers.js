Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('greaterThan', function (a, b) {
    return a > b;
});
Template.registerHelper('ternary', function (condition, ifTrue, ifFalse) {
    return condition ? ifTrue : ifFalse;
});
Template.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
});
Template.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
});
Template.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});
Template.registerHelper('loopCount', function(count, start) {
    if (!start || !_.isNumber(start)) start = 0;
    var countArr = [];
    for (var i=start; i<count + start; i++){
        countArr.push(i);
    }
    return countArr;
});

var imageServer = Meteor.settings.public.imagesUrl || "http://127.0.0.1:8080/";

Template.registerHelper('originalImagePath', function (image) {
    return imageServer + "originals/" + image;
});

Template.registerHelper('resizedImagePath', function (image) {
    return imageServer + "resized/" + image;
});

Template.registerHelper('videoPath', function (image) {
    return imageServer + "videos/" + image;
});