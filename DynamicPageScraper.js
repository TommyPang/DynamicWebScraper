const puppeteer = require('puppeteer');
const url = 'https://www.bestbuy.ca/en-ca';
const url2 = 'https://www.bestbuy.ca/en-ca/collection/computers-and-tablets/242130?icmp=home_shopbycategory_event_computersandtablets';

(async function scrape() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log("We are scraping from " + url2 + ":");
    await page.goto(url2);

    /*
    // First Example - get all href
    let hrefs = await page.evaluate(() => {
        let Element = Array.from(document.body.querySelectorAll('a'), (el) => el.href);
        return Element;
    });

    console.log(hrefs);

    // Second Example - get iPhone urls
    let hrefs = await page.evaluate(() => {
        let Element = Array.from(document.body.querySelectorAll('a'), (el) => el.href);
        return Array.from(new Set(Element));
    });
    let res = [];
    for (let i = 0; i < hrefs.length; i++) {
        if (hrefs[i].indexOf("iphone") > -1) {
            res.push(hrefs[i]);
        }
    }
    console.log(res);
    */
    let hrefs = await page.evaluate(() => {
        let Element = Array.from(document.body.querySelectorAll('a'), (el) => el.href);
        return Array.from(new Set(Element));
    });
    let res = [];
    for (let i = 0; i < hrefs.length; i++) {
        if (hrefs[i].indexOf("laptop") > -1) {
            res.push(hrefs[i]);
        }
    }
    for (let i = 0; i < res.length; i++) {
        await page.goto(res[i]);
        let item_name = await page.evaluate(() => {
            let selector = document.body.querySelector('h1');
            if (selector===null) return null;
            return selector.textContent;
        });
        if (item_name === null) continue;
        let spans = await page.evaluate(() => {
            return Array.from(document.body.querySelectorAll('span'), (el) => el.textContent);
        });
        let price, promotion;
        for (let j = 0; j < spans.length; j++) {
            if (spans[j] != null && (spans[j].indexOf("$") > -1)) {
                if ((spans[j].indexOf("SAVE") > -1)) {
                    promotion = spans[j];
                    price = spans[j+2];
                    break;
                }
            }
        }
        if (promotion===undefined
            || price===undefined
            || price.indexOf("$") === -1
            || promotion.indexOf("$") === -1
        ) continue;
        console.log({ "name":item_name, "price":price , "promotion": promotion});
    }

    await browser.close();

})().catch(function(err){
    console.log(err);
});