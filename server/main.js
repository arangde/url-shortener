import { Meteor } from 'meteor/meteor';
import '../imports/api/urls.js';

Meteor.startup(() => {
    Future = Npm.require('fibers/future');
});
