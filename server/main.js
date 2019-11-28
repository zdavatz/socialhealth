import {
    Meteor
} from 'meteor/meteor';

// import './social.health.js'
import _ from 'lodash'

import './utili/lib.js'

log = console.log;

import './search.google.js'





log('-----------Social Health-------------')




/**
 * Import CSV Files
 * 
 */

var data = App.importCSV('csv_input_socialhealth.csv')
/**
 * Insert Data
 */
App.insertItemsBatch(data)

//
Meteor.methods({
    search(obj){
        
        var item;
        var keywordsArr = getKeywords(obj.keywords)

        obj.queries = queryCreate(obj.fullname , keywordsArr)


        log(obj)

        // Insert in DB 

        // return
        var itemId = Items.insert(obj)

        searchItem(itemId,obj.queries)

        // Perform Search 

        // Return the results 
        

        log('search method: ',obj,itemId)

        return itemId;
    }
})

/**
 * 
 * Publish
 */

 Meteor.publish('results',function(id){
    return Results.find({item:id,valid:true})
 })


/**
 * 
 * @param {*} keywords 
 */

function getKeywords(keywords){
    var keywords = keywords.replace(/\s/g, '');
    var keywords = keywords.split(',');
    log('keywords',keywords)
    return keywords
}

/**
 * Query Create
 * @param {*} name 
 * @param {*} keywordsArr 
 */
function queryCreate(name,keywordsArr){
    var searchKeywords = []
    _.each(keywordsArr,(keyword)=>{
        var query = name + ' ' + keyword
        searchKeywords.push({keyword:keyword,query:query})
    })
    return searchKeywords
}

/**
 * 
 * @param {*} id 
 */
 function searchItem(itemId,queries){

    _.each(queries,(query)=>{
        log('searching',query.query)
        Search.search(itemId,query)
    })

 }


  /**
   * 
   * @param {*} id 
   * @param {*} result 
   */
  function searchItemUpdate(id,key,result){

  }
