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