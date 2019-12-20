import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
_ = lodash;
import './main.html';
import './search.html'
log = console.log
Items = new Mongo.Collection('items');
Results = new Mongo.Collection('results');

/**
 * 
 */
Template.socialHealth.onCreated(function () {
  self = this;
  Tracker.autorun(function(){
    var operation = App.getSetting('operationId')
    Meteor.subscribe('results',operation)
  });

  Meteor.call('stats',(err,data)=>{
    log('stats', data)
    if(data){
      App.setSetting({stats:data})
    }
  })



});
/**
 * 
 */
Template.socialHealth.events({
  'click .search, submit #search'(event, instance) {
    event.preventDefault()
    var isChecked = $('#isAPI').checked
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

      App.setSetting({isAPI:isAPI})

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
  items(){
    if(App.getSetting('keywordFilter')){
  
      log('Filtering Keywords',App.getSetting('keywordFilter'))
      var keywords = App.getSetting('keywordFilter')
      return Items.find({keywords:{$regex: keywords}},{sort:{createAt:-1}})
    }else{
      return Items.find({},{sort:{createAt:-1}})
    }
    
  },
  getCount(index){
    var items =  Items.find({},{sort:{createAt:-1}}).count()
    var count = items - parseInt(index)
    // log(count)
    return count
  }

});

/**
 * 
 */

Template.resultsData.helpers({
  resultsList(){
    var id = this.id
    return Results.find({item:id}).fetch()
  }
})

/**
 * 
 */

Template.registerHelper('mkList', (str) => {
  var arr = str.split(',');
  return arr;
})

