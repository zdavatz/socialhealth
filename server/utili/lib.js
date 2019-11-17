/**
 * Scrapping Utilties for Meteor
 * 
 * DB. Collection
 * Data Engine
 * Logging
 * Flow (Pupeteer)
 */
/**
 * Imports
 */
import YAML from 'yaml'
const fs = require('fs')

/**
 * Collection
 */
Items = new Mongo.Collection('items')
/**
 * 
 */
App = {}
Flow = {}
/**
 * Paths
 */
Dir = {}
Dir.root = process.env['METEOR_SHELL_DIR'] + '/../../../';
Dir.public = Dir.root + 'public/';
Dir.exp = Dir.public + 'exp'


/**
 * 
 */
log = console.log
/**
 * ==================================
 * 
 *          
 * 
 * IO
 * 
 *== Assets
 *      
 * 
 * ==================================
 */
/** Get JSON Data from Assets File */
App.getJSON = (file) => {
  var data = JSON.parse(Assets.getText('partner.json'))
  if (_.isObject(data)) {
    return data;
  }
}
/**
 * App.prepareJSON
 */

 App.JSONReady = (data)=>{
   return JSON.stringify(data)
 }
/**
 * Write to file
 * Write file to Disk
 => ('/export/FILENAME',data)
 => App.writeFile('/public/file.txt',['s'])
 */
App.writeFile = async (file, data) => {
  log('Writing file')
  await fs.writeFileSync(Dir.root + file, data, (err) => {
    if (err) log('error', err);
    log('progress', "File updated" + file);
  });
}


/**
 * Check If A FILE  exists or not
 */
App.isFileExists = (filePath) => {
  let isFileExists = fs.existsSync(+filePath);
  if (isFileExists) {
    return true
  }
}
/**
 * 
 * Database Utilities
 * 
 * 
 */
/**
 * App.batchColInsert(Collection, Data "Array", field "Project")
 */
App.batchColInsert = (col, data, field) => {
  if (!data || !data.length || !field || !global[col]) {
    console.log('DB:batchInsert Err', col)
    return;
  }
  _.each(data, (item) => {
    let isExist = global[col].findOne({
      [field]: item[field]
    })
    if (!isExist) {
      console.log('DB.batchColInsert: Success,', item[field], 'Inserted')
      global[col].insert(item)
    } else {
      console.log('DB.batchColInsert: Success[Exists], Doc', item[field], 'Exists')
    }
  })
}
/**
 * App.itemInsert(doc[Object], field[Unique] , type[Project])
 */
App.itemInsert = (doc, field, type) => {
  var isItem = Items.findOne({
    [field]: doc[field],
    type: type
  })
  if (!isItem) {
    Items.insert(doc);
    log('success', 'DB: Doc Inserted : ' + doc[field] + ' - ' + doc['name'] + ' - Project:' + type)
  } else {
    // Update products
    log('warning', 'DB: Doc Exists' + doc[field])
    Items.update({
      _id: isItem._id
    }, {
      $set: doc
    })
    log('success', 'DB: Doc Update' + doc[field])
  }
}
/**
 * App.itemUpdate
 */
App.itemUpdate = (col, field, data) => {
}
/**
 * App.fetch
 * => Return JSON array of ITEMS
 */
App.fetch = (project) => {
  return Items.find({
    project: project
  }).fetch()
}
/**
 * Exports
 */
module.exports = App;
module.exports = Flow;
module.exports = Dir;