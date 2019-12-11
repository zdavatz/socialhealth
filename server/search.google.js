/**
 * =======
 *  Search Google
 * =======
 */
import _ from 'lodash'
import '../settings/keys.api';
import './utili/lib'
import './utili/social.health.lib'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
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
        first.isSerp = true;
        first.isPub = false;
        first.createdAt = new Date();

        //
        var itemObj = getItem(id)
        log(itemObj)
        //
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
Search.puppeteer = (id,queries)=>{
    log('Searching Puppeteer',id, queries)
    pupSearch(id,queries)
}
//
/**
 *  Puppeteer Search: 
 * 
 * @param {*} id 
 * @param {*} queries 
 */
async function pupSearch(id,queries){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        await page.goto('https://google.com');
        log('search q:',queries)
        for (var i = 0; i < queries.length; i++) {
            var account = queries[i].keyword
            var keyword = queries[i].query
            console.log('puppeteer: keyword',keyword)
            await page.waitFor(_.random(131,393));
            await page.focus('input[name=q]');
            await page.waitFor(_.random(131,893));
            await page.keyboard.press('Home');
            await page.keyboard.down('Shift');
            await page.keyboard.press('End');
            await page.keyboard.up('Shift');
            await page.keyboard.press('Backspace');
            await page.keyboard.type(keyword);
            await page.waitFor(_.random(100,593));
            await page.keyboard.press('Enter');
            // 
            await page.waitFor(1000);
            // 
            await page.waitFor(_.random(100,400));
            // await navigationPromise;
            // await page.waitForSelector('div.g');


            let content = await page.content();
            var $ = cheerio.load(content);

            var title = $('h3').first().text()
            var link = $('.r > a').first().attr('href')
            // var title = titles.split('•')[0]
            // var title = title.split('|')[0]
            log('title',title,link)

            var first = {
              title: title,
              link: link
            }

            // REMOVE THE INCOMING 
            // MODIFY THE REST


            // const links = await page.$$('div.r');
            // var l = await links[0].click();

            // log('l',l)

            // const results = await page.evaluate(() => {
            //   // Google
            //   var content = document.querySelectorAll('div.g');
            //   var title = document.querySelectorAll('.r')
            //   // var content = document.querySelectorAll('div.result_actions')

            //   // let pageContent = await page.content();

              


            //   var c = content[0]
            //   // var title = title[0]


            //   //  #rso > div:nth-child(3) > div > div:nth-child(1) > div
            //   if (!c) {
            //     return
            //   }
            //   var url = c.innerHTML
            //   var regexURL = /(https?:\/\/[^ ]*)/
            //   var url = url.match(regexURL)[1];
            //   var url = url.slice(0, -1)
            //   // console.log('url:',url,title)
            //   return {link:url,title:'title'}
            // })
            /**
             * 
             */
            //
            // log('RESULTS',results)

            if(first && Regex.txt[account] && first.link.search(Regex.txt[account]) > -1){
              // var first = {}
              first.item = id;
              first.keyword = account
              first.query = keyword
              first.valid = true;
              first.isPub = true;
              first.isSerp = false;
              first.createdAt = new Date();
              
              log('Insert Before: Validation ',first)
              Results.insert(first, function(err){
                log(err,'inserted')
              })
              // log('Matcged', results)
            }
            // 
            // log('Puppetter: Results; ',results)
            // return 
        //   }
        }
        // closing the browser
        log('closing the browser')
        await browser.close();
      } catch (error) {
        log('error', error)
      }
    log('Async Scrap',id,queries)
}



/**
 * 
 * @param {*} keyword 
 */

 function getItem(id){
     return Items.findOne(id)
 }
/**
 * 
 * ==============================================================================================
 */
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