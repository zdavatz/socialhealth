import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
_ = lodash;
import './main.html';
import './search.html'
log = console.log
Items = new Mongo.Collection('items');
Results = new Mongo.Collection('results');
Template.socialHealth.onCreated(function () {
  // counter starts at 0
  // Meteor.subscribe('history')
  Tracker.autorun(function(){
    // var operation = Session.get('operationId')
    var operation = App.getSetting('operationId')
    // if(!operation){
    //   return
    // }
    Meteor.subscribe('results',operation)
  })
});
/**
 * 
 */
Template.socialHealth.events({
  'click .search, submit #search'(event, instance) {
    event.preventDefault()
    var isChecked = $('#isAPI').checked
    // App.setSetting:
    // log(isChecked)
    var searchEle = {
      name: $('#name').val(),
      surname: $('#surname').val(),
      fullname: $('#name').val() + ' ' + $('#surname').val(),
      keywords: $('#keywords').val(),
      isAPI: App.getSetting('isAPI')
    }
    log(searchEle)
    if(!searchEle.name || !searchEle.surname){
      alert('Search keywords are missing')
      return
    }
    Meteor.call('search',searchEle,(err,results)=>{
      console.log(err,results)
      if(err){
        alert('SERPI api key is missing')
      }
      if(results){
        App.setSetting({operationId: results})
        Session.set({operationId: results})
      }
    })
  },
  'click #isAPI'(e){
    var isAPI = $(e.currentTarget).is(":checked")
    log('checked',isAPI)
    // if(isChecked){
      App.setSetting({isAPI:isAPI})
    // }
  },
});
/**
 * 
*/
Template.socialHealth.helpers({
  results() {
    return Results.find({item:App.getSetting('operationId')}).fetch()
  },
  resultsJSON(){
    var r = Results.find().fetch()
    var r = JSON.stringify(r, undefined, 2) 
    if(r.length){
      return r;
    }else{
      return null
    }
  },
  /**
   * isHistory: Toggle
   */
  isHistory(){
    return App.getSetting('history')
  },
  /**
   * History: results
   */
  history(){
    var data = []
    var r = Results.find({item:{$nin:[App.setSetting('operationId')]}},{sort:{createdAt:-1}}).fetch()
    var r = _.groupBy(r,'item')

    _.each(r, (i,key)=>{
      log(i, key)
      var item = Items.findOne(key)
      item.results = i;
      data.push(item)
    })

    log(data)
    return data
  }

});



