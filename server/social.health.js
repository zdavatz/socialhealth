import {
  Meteor
} from 'meteor/meteor';
import _ from 'lodash'
import './utili/lib.js'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
SH = {}
SH.isTest = true;
SH.debug = true;
/**
 * Social networks
 */
SH.accounts = ["twitter", 'facebook', 'linkedin', 'youtube', 'instagram']
SH.keyword = ['twitter', 'facebook', 'linkedin', 'youtube channel', 'instagram']
SH.testQuery = ['acibadem', 'medicalpark']
SH.text = 'acibadem twitter'
/**
 * Regex 
 */
SH.regex = {}
SH.regex.url = /(https?:\/\/[^ ]*)/;
SH.regex.facebook = 'facebook'
SH.regex.twitter = 'https://twitter.com/'
SH.regex.instagram = 'instagram.com'
SH.regex.youtube = 'youtube.com'
SH.regex.linkedin = 'linkedin'


Regex = {
  twitter: /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
  facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/,
  linkedin: /http(s)?:\/\/([\w]+\.)?linkedin\.com\/pub\/[A-z0-9_-]+(\/[A-z0-9]+){3}\/?/,
  youtube: /((http|https):\/\/|)(www\.|)youtube\.com\/(channel\/|user\/)[a-zA-Z0-9\-]{1,}/,
  instagram: /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/

}
/** 
 * 
 */
var hospitalsSamples = ['acibadem', 'medical park', 'medipol']

var hospitals = Items.find({
  'ROLE.TYPE': "Hosp",
  isChecked: {
    $ne: true
  }
}).fetch()
log('Checking Hospitals', hospitals.length)

// _.each(sampleHospitals,(i)=>{
//   Items.update(i._id,{$unset:{isChecked:1}})
// })

//
stats()
scrap()




// console.log(sampleHospitals)
/**
 * 
 */
var data = JSON.parse(Assets.getText('partner.json'))
var items = data.Envelope.Body.PARTNER.ITEM;
// log(items[0])
var dataSample = _.take(items, 5);
// Items.remove({})
SH.batchInsert = (data) => {
  log('===============')
  log('Importing starts')
  _.each(data, (item) => {
    var isExist = Items.findOne({
      GLN: item.GLN
    })
    if (!isExist) {
      log('importing', item.GLN)
      item.createdAt = new Date()
      Items.insert(item)
    } else {
      log('----')
      log('already imported')
      log(item.GLN)
    }
  });
  console.log('All Items has been inserted')
}
/**
 * Scrap
 */

// var hospitals = sampleHospitals;
SH.isTest = true;
async function scrap() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});


    await page.goto('https://google.com');

    // await page.goto('https://duckduckgo.com/')

    // await page.goto('https://www.qwant.com')

    /**
     * 
     */



    /**
     * 
     */
    for (var i = 0; i < hospitals.length; i++) {

      var hospital = hospitals[i]["DESCR1"]
      // return
      //SH.accounts
      for (var p = 0; p < SH.accounts.length; p++) {
        var keyword = hospital + " " + SH.keyword[p]
        log(i, ' : ', hospital, ' : ', keyword)
        var data = {
          keyword: keyword,
          name: SH.accounts[p],
          url: ""
        }
        await page.waitFor(_.random(131,693));
        // Works for DuckDuckGo + Google
        await page.focus('input[name=q]');
        await page.waitFor(_.random(131,693) * _.random(1,8));
        await page.keyboard.press('Home');
        await page.keyboard.down('Shift');
        await page.keyboard.press('End');
        await page.keyboard.up('Shift');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(keyword);
        await page.waitFor(_.random(10,693) * _.random(1,5));
        await page.keyboard.press('Enter');
        // 
        // await page.keyboard.press('Enter');

        
        await page.waitFor(1000);
        await page.screenshot({
          path: Dir.public + 'example2.png'
        });

        await page.waitFor(_.random(100,400) * _.random(1,7));
        // await navigationPromise;
        // await page.waitForSelector('div.g');
        
        

        const results = await page.evaluate(() => {
          // Google
          var content = document.querySelectorAll('div.g')
          // DuckDuckGo
          // var content = document.querySelectorAll('div.result--url-above-snippet .result__extras')
          //
          //  

          // var content = document.querySelectorAll('div.result_actions')
          var c = content[0]
          if (!c) {
            return
          }
          var url = c.innerHTML
          var regexURL = /(https?:\/\/[^ ]*)/
          var url = url.match(regexURL)[1];
          var url = url.slice(0, -1)
          console.log(url)
          return url
        })
        /**
         * 
         */
        // 
        log(results)
        // return 
        if (results && results.search(SH.regex[SH.accounts[p]]) > -1) {
          log('==========SUCCESS===========')
          log(hospitals[i]["DESCR1"], " ", [SH.accounts[p]], " ", results)
          Items.update({
            _id: hospitals[i]._id
          }, {
            $set: {
              [SH.accounts[p]]: results,
              isChecked: true
            },
            $addToSet: {
              checked: SH.accounts[p]
            }
          })
          // log(Items.findOne({_id: hospitals[i]._id}))
        } else {
          Items.update({
            _id: hospitals[i]._id
          }, {
            $set: {
              [SH.accounts[p]]: null,
              isChecked: true
            }
          })
          log('==========No-Results ', hospitals[i]["DESCR1"], " ", [SH.accounts[p]], '===========')
          log('==========SKIPPED===========', results)
        }
      }
    }
    // closing the browser
    log('closing the browser')
    await browser.close();
  } catch (error) {
    log('error', error)
  }
}
/**
 * Stats
 */
function stats() {
  var logs = {}
  logs.items = Items.find().count()
  logs.hospitals = Items.find({
    'ROLE.TYPE': "Hosp"
  }).count()
  logs.hospital = Items.find({
    'ROLE.TYPE': "Hosp"
  }).fetch()[4]
  logs.checked = Items.find({
    'ROLE.TYPE': "Hosp",
    isChecked: true
  }).count()
  logs.checkedNOT = Items.find({
    'ROLE.TYPE': "Hosp",
    isChecked: {
      $ne: true
    }
  }).count()

  logs.twitter = Items.find({'ROLE.TYPE': "Hosp",twitter:{$ne:null}}).count()
  logs.facebook = Items.find({'ROLE.TYPE': "Hosp",facebook:{$ne:null}}).count()
  logs.instagram = Items.find({'ROLE.TYPE': "Hosp",instagram:{$ne:null}}).count()
  logs.linkedin = Items.find({'ROLE.TYPE': "Hosp",linkedin:{$ne:null}}).count()
  logs.youtube = Items.find({'ROLE.TYPE': "Hosp",youtube:{$ne:null}}).count()

  log(logs)



  App.writeFile('/public/data.json',App.JSONReady(Items.find({'ROLE.TYPE': "Hosp",$or:[{youtube:{$ne:null}},{facebook:{$ne:null}},{twitter:{$ne:null}},{instagram:{$ne:null}},{linkedin:{$ne:null}}]}).fetch()))
}