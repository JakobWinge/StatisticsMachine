if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.hello.helpers({
        counter: function () {
            return Session.get('counter');
        },

        images: function () {
            return Images.find();
        }
    });

    Template.hello.events({
        'click button': function () {
            // increment the counter when button is clicked
            Meteor.call('scanFiles');
            Session.set('counter', Session.get('counter') + 1);
        }
    });
}

Images = new Meteor.Collection("images");

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
    var _IMAGEFOLDER = "pics";
    var _RENAME = true;
    var _RESIZE = true;

    var insertToMongo = function (parsedImage, metadata) {
        Images.insert({
            extname: parsedImage.extname,
            baseName: parsedImage.baseName,
            id: parsedImage.id,
            dirArray: parsedImage.dirArray,
            path: imagePath + "/" + parsedImage.id,
            dateTimeOriginal: metadata.exif.dateTimeOriginal,

            sensor1: null,
            sensor2: null,
            sensor3: null,
            sensor4: null,
            soundwheel: null,
            rate: null,
            klassetrin: null
        });
    };

    Meteor.methods({
        'scanFiles': function () {
            var fileTypes = [".jpg", ".png", ".bmp"];

            // parallel recursive file finder
            var fs = Npm.require('fs');
            var path = Npm.require('path');
            var crypto = Npm.require('crypto');
            var Fiber = Npm.require('fibers');

            var walk = function (dir, done) {
                var results = [];
                fs.readdir(dir, function (err, list) {
                    if (err) return done(err);
                    var pending = list.length;
                    if (!pending) return done(null, results);
                    list.forEach(function (file) {
                        file = path.resolve(dir, file);
                        fs.stat(file, function (err, stat) {
                            if (stat && stat.isDirectory()) {
                                walk(file, function (err, res) {
                                    results = results.concat(res);
                                    if (!--pending) done(null, results);
                                });
                            } else {
                                results.push(file);
                                if (!--pending) done(null, results);
                            }
                        });
                    });
                });
            };

            walk('../../../../../public/pics', Meteor.bindEnvironment(function (err, results) {
                if (err) throw err;
                //run through all files
                results.forEach(function (entry) {
                    //check filetype
                    if (fileTypes.indexOf(path.extname(entry).toLowerCase()) > -1) {
                        var basename = path.basename(entry);

                        // if the image is new to the system..
                        if (basename.substring(0, 3) !== "SM_") {

                            //parsed object from path
                            var parsedImage = {
                                originalName: entry,
                                extname: path.extname(entry).toLowerCase(),
                                baseName: path.basename(entry, path.extname(results[0])),
                                id: null,
                                dirArray: []
                            };

                            //generate random id for filename
                            parsedImage.id = "SM_" + parsedImage.baseName + "_" + crypto.randomBytes(10).toString('hex') + parsedImage.extname;

                            var imagePath = _IMAGEFOLDER;

                            //add to directory array
                            var dirs = path.dirname(entry).split(path.sep);

                            for (var i = 0; i <= dirs.length; i++) {
                                if (dirs[i] == "pics") {
                                    for (var j = i + 1; j < dirs.length; j++) {
                                        parsedImage.dirArray.push(dirs[j]);
                                        imagePath += "/" + dirs[j];
                                    }
                                    break;
                                }
                            }

                            var metadata = Imagemagick.readMetadata(entry);

                            insertToMongo(parsedImage, metadata);
                            //Resizing images
                            console.log("Resizing image: " + parsedImage.baseName);

                            var finaldestination = path.dirname(parsedImage.originalName) + "/" + parsedImage.id;
                            fs.rename(parsedImage.originalName, finaldestination, Meteor.bindEnvironment(function (err) {
                                if (err) console.log('ERROR: ' + err);
                                Imagemagick.convert([finaldestination, '-resize', '816x544', finaldestination]);
                            }));

                        } else {
                            //if the file is already registered..
                            //console.log("Image already identified: " + path.basename(entry) + ". Checking whether database path matches..");
                            //check om de matcher
                            var instance = Images.find({id: path.basename(entry)}).fetch();
                            console.log(instance);
                            // hvis ikke, upload det nye object
                        }

                    } else {
                        console.log("File skipped: " + entry);
                    }
                });
                console.log("All files scanned.");
            }));

        }
    });
}