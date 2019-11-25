/**
 * =======
 *  Search Google
 * =======
 */

import '../settings/keys.api'

// console.log(SerpiKey)

const GSR = require('google-search-results-nodejs')

let client = new GSR.GoogleSearchResults(SerpiKey)

var parameter = {
    q: "Coffee",
    location: "Austin, Texas, United States",
    hl: "en",
    gl: "us",
    google_domain: "google.com",
};

var callback = function(data) {
  console.log(data)
}

// Show result as JSON
client.json(parameter, callback)
