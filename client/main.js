import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './search.html'
log = console.log

Items = new Mongo.Collection('items');
Results = new Mongo.Collection('results');

Template.socialHealth.onCreated(function () {
  // counter starts at 0

  Tracker.autorun(function(){
    var operation = App.getSetting('operationId')
    log(operation)
    Meteor.subscribe('results',operation)
  })

});
/**
 * 
 */

Template.socialHealth.events({
  'click .search, submit #search'(event, instance) {
    event.preventDefault()

    

    var searchEle = {
      name: $('#name').val(),
      surname: $('#surname').val(),
      fullname: $('#name').val() + ' ' + $('#surname').val(),
      keywords: $('#keywords').val()
    }

    if(!searchEle.name || !searchEle.surname){
      alert('Search keywords are missing')
      return
    }
    Meteor.call('search',searchEle,(err,results)=>{
      console.log(err,results)
      if(results){
        App.setSetting({operationId: results})
      }
    })

  },
});



/**
 * 
*/


Template.socialHealth.helpers({
  results() {
    return Results.find().fetch()
  },
  resultsJSON(){
    var r = Results.find().fetch()
    var r = JSON.stringify(r, undefined, 2) 
    if(r.length){
      return r;
    }else{
      return null
    }
    
  }
});

