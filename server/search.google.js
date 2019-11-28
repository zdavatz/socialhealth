/**
 * =======
 *  Search Google
 * =======
 */
import '../settings/keys.api';
import './utili/lib'
import './utili/social.health.lib'
const GSR = require('google-search-results-nodejs')
const client = new GSR.GoogleSearchResults(SerpiKey)
Search = {}
Search.queryCreate = ()=>{
}
/**
 * @name: Search
 * @param: 
 *     - id: itemID
 *     - query[keyword, query]       
 * 
 * 
 * Save all URLS (Results)
 * Parse the first one
 * 
 */
Search.search = (id,query)=>{
    log('------Search Init-------')
    log('Search.search',id,query)
    // var self =
    // return
    // return
    var parameter = {
        q: query.query,
        // location: "Austin, Texas, United States",
        // hl: "en",
        // gl: "us",
        google_domain: "google.com",
    };

//
    client.json(parameter, Meteor.bindEnvironment((data) => {
        // results : data.organic_results[].link/ title
        // First Result 
        var first = data.organic_results[0]
        
        first.item = id;
        first.keyword = query.keyword
        first.query = query.query

        log(first)
        if(Regex.txt[query.keyword] && first.link.search(Regex.txt[query.keyword]) > -1){
            first.valid = true;

            // Results.rawCollection().insert(first)

            Results.insert(first)
      
            
            log('----------Found-----------')
            // log(first)
            log('----------SUCCESS-----------')
        }else{
            // Insert Invalid Result [Draft]
            // first.valid = false
            // Results.insert(first)  
            log('Result does not match',Regex.txt[query.keyword])
        }
     
    }))
}
/**
 * 
 * @param {
 * } keyword 
 */

// log('results',Results.find().fetch())
/**
 * 
 * Draft
 */
function searchGoogle(keyword) {
    var parameter = {
        q: keyword,
        // location: "Austin, Texas, United States",
        // hl: "en",
        // gl: "us",
        google_domain: "google.com",
    };
    client.json(parameter, (data) => {
        console.log(data)
    })
}
// searchGoogle('Zeno;Davatz;OpenSource, Github, Software')
module.exports = Search