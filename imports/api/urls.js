/**
 * Created by jaran on 9/14/2016.
 */
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Urls = new Mongo.Collection('urls');

if (Meteor.isServer) {
    Meteor.publish('urls', function () {
        return Urls.find();
    });

    Meteor.methods({
        'urls.insert': function(url) {
            check(url, String);

            var future = new Future();

            HTTP.call("HEAD", url, function (error, result) {
                if (error) {
                    future["return"](error);
                }
                else {
                    var shortUrl = "";
                    var exists = true;

                    while (exists) {
                        shortUrl = randomString(6);
                        exists = Urls.find({shortUrl: shortUrl}).count() ? true : false;
                    }

                    Urls.insert({
                        url: url,
                        shortUrl: shortUrl,
                        createdAt: new Date(),
                        visitCount: 0
                    });

                    future["return"](null);
                }
            });

            return future.wait();
        },

        'urls.update': function (options) {
            check(options._id, String);
            check(options.visitCount, Number);

            Urls.update(options._id, {"$set": {visitCount: options.visitCount}});
        }
    });
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}