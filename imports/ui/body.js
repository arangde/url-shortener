/**
 * Created by jaran on 9/14/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Urls } from '../api/urls.js';

import './body.html';

FlowRouter.route('/', {
    name: 'home',
    action: function(params) {
        console.log("This is home");

        Template.body.onCreated(function bodyOnCreated() {
            this.state = new ReactiveDict();
            Meteor.subscribe('urls');
        });

        Template.registerHelper('baseUrl', function() {
            return Meteor.settings.public.baseUrl;
        });

        Template.body.helpers({
            isRedirecting() {
                return false;
            },
            urls() {
                return Urls.find({}, { sort: { createdAt: -1 } });
            },
            urlDoc() {
                const instance = Template.instance();
                if(instance.state.get('enteredUrl')) {
                    return Urls.findOne({url: instance.state.get('enteredUrl')});
                }
            },
            invalidUrl() {
                const instance = Template.instance();
                if(instance.state.get('invalidUrl') === true) {
                    return true;
                }

                return false;
            },
            checkingUrl() {
                const instance = Template.instance();
                if(instance.state.get('checkingUrl') === true) {
                    return true;
                }

                return false;
            }
        });

        Template.body.events({
            'submit .form-url'(event, instance) {
                event.preventDefault();

                const target = event.target;
                const url = target.enteredUrl.value;

                instance.state.set('enteredUrl', null);
                instance.state.set('invalidUrl', false);
                instance.state.set('checkingUrl', true);

                if(!(url.startsWith("http://") || url.startsWith("https://"))) {
                    instance.state.set('invalidUrl', true);
                    instance.state.set('checkingUrl', false);
                    return false;
                }

                Meteor.call('urls.insert', url, function(response, err) {
                    instance.state.set('checkingUrl', false);
                    if(err) {
                        instance.state.set('invalidUrl', true);
                    }
                    else {
                        instance.state.set('enteredUrl', url);
                    }
                });
            },
        });
    }
});

FlowRouter.route('/:shortUrl', {
    name: 'shortUrl',
    action: function(params) {
        console.log("This is short URL:", Meteor.settings.public.baseUrl + params.shortUrl);

        Template.body.onCreated(function bodyOnCreated() {
            Meteor.subscribe('urls', {
                onReady: function() {
                    const urlDoc = Urls.findOne({shortUrl: params.shortUrl});
                    if(urlDoc) {
                        const visitCount = parseInt(urlDoc.visitCount) + 1;
                        console.log('redirect to ', urlDoc.url);

                        Meteor.call('urls.update', {_id: urlDoc._id, visitCount: visitCount});

                        console.log(window);
                        window.location.href = urlDoc.url;
                    }
                    else {
                        console.log("Not found in URLs collection", params.shortUrl);
                        window.location.href = Meteor.settings.public.baseUrl;
                    }
                }
            });
        });

        Template.body.helpers({
            isRedirecting() {
                return true;
            }
        });

    }
});

FlowRouter.notFound = {
    action: function() {
        window.location.href = Meteor.settings.public.baseUrl;
    }
};
