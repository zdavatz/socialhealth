import {
    Meteor
} from 'meteor/meteor';
// import './social.health.js'
import _ from 'lodash'
import './utili/social.health.lib.js'
import './utili/lib.js'
// KEYS
import '../settings/keys.api';


log = console.log;
import './search.google.js'
log('-----------Social Health-------------')
/**
 * Metehor Methods
 */

Meteor.methods({
    search(obj) {
        // var keywordsArr = getKeywords(obj.keywords)
        obj.queries = queryCreate(obj.fullname, obj.keywords)
        obj.createAt = new Date();
        var itemId = Items.insert(obj)
        if(obj.isAPI){
            log('===== USING API =====')
            if(!SerpiKey){
                log('SerpiKey is not found')
                throw new Meteor.Error('SERPI API Key is missing')
                return
            }
            searchItem(itemId,obj.queries)
        }else{
            log('===== USING Puppeteer =====')
            searchPuppeteer(itemId, obj.queries)
        }
        log('Searchi Method: Init', itemId)
        return itemId;
    }
})
/**
 * 
 * Publish: Result
 */
Meteor.publish('results', function (id) {
    if(!id){
        return
    }
    var res= Results.find({item:id}).count()
    // log('Publish: #Results ', id)
    return Results.find({
        item: id,
        valid: true
    })
})

/**
 * 
 * Publish: History 
 */

 Meteor.publish(null,function(){
    var ids = Items.find({},{sort:{createAt:-1}}).fetch()
    var ids = _.map(ids,(id)=>{
        return id._id
    })
    var results = Results.find({item:{$in:ids}})
    return results;
 })

 Meteor.publish(null,function(){
    var items = Items.find({},{limit:40,sort:{createAt:-1}})
    return items;
 })

 //

//  Results.remove({})
// Items.remove({})


log(Results.find().count())
/**
 * 
 * @param {*} keywords 
 */
function getKeywords(keywords) {
    var keywords = keywords.toLowerCase()
    var keywords = keywords.replace(/\s/g, '');
    var keywords = keywords.split(',');
    log('keywords', keywords)
    return keywords
}
/**
 * Query Create
 * @param {*} name 
 * @param {*} keywordsArr 
 */
function queryCreate(name, keywordsArr) {
    var searchKeywords = []
    for (var p = 0; p < SH.accounts.length; p++) {
        var query = name + " " + keywordsArr + " " + SH.keyword[p]
        var query = {
            keyword: SH.accounts[p],
            query: query,
        }
        searchKeywords.push(query)
    }
    return searchKeywords
}
/**
 * 
 * @param {*} id 
 */
function searchItem(itemId, queries) {
    // Loop every Query => for Social Media Links
    _.each(queries, (query) => {
        log('searching', query.query)
        Search.search(itemId, query)
    })
}
/**
 * 
 * @param {*} id 
 * @param {*} result 
 */
function searchPuppeteer(itemId, queries) {
    log('search q', queries)
    Search.puppeteer(itemId, queries)
}
/**
 * Import CSV Files
 * 
 */
var data = App.importCSV('csv_input_socialhealth.csv')
/**
 * Insert Data
 */
App.insertItemsBatch(data)