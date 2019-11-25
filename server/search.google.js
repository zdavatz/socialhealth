/**
 * =======
 *  Search Google
 * =======
 */

import '../settings/keys.api'

// console.log(SerpiKey)

const GSR = require('google-search-results-nodejs')
const client = new GSR.GoogleSearchResults(SerpiKey)



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


searchGoogle('Zeno;Davatz;OpenSource, Github, Software')