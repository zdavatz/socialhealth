/**
 * =====================
 * Flow [Puppeteer]
 * ---------------------
 */

import './lib.js'

FlowPup = {}

FlowPup.goto = async (url, page, delay) => {
    await page.goto(url, {
        waitUntil: 'load'
    });
}
/*
  Screenshot for debugging
 */
FlowPup.screenshot = async (page, file, fullpage) => {
    if (!page || !file || (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file) == false) {
        console.log('Error in image file or connection')
        return
    };
    console.log('screen', 'Screenshot saved:' + file)
    await page.screenshot({
        path: exp + file,
        fullPage: fullpage
    });
}
/**
 * Click link
 */
FlowPup.click = async (page, el, delay, msg) => {
    await page.waitForSelector(el)
    await page.click(el);
    console.log('step', 'Event[click]: ' + msg)
    if (delay && Number.isInteger(delay)) {
        //console.log('Clicked: el', el, 'loading...', delay)
        await page.waitFor(delay);
    }
}

module.exports = FlowPup