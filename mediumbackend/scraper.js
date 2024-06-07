

const puppeteer = require('puppeteer');

async function scrapeMedium(topic) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const searchUrl = `https://medium.com/search?q=${encodeURIComponent(topic)}`;
  console.log(searchUrl);
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  let articles = [];

  // Wait for the articles to load
  await page.waitForSelector('article');

  // Select all article elements
  const elements = await page.$$('article');

  for (let element of elements) {
    // Extract the title
    const titleElement = await element.$('h2');
    const title = titleElement ? await page.evaluate(el => el.textContent, titleElement) : null;

    // Extract the author
    const authorElement = await element.$('p');
    const author = authorElement ? await page.evaluate(el => el.textContent, authorElement) : null;

    // Extract the publication date by navigating to the appropriate span
    const dateElement = await element.$('span');
    const date = dateElement ? await page.evaluate(el => el.textContent, dateElement) : null;
    const lst = date.split('·')
    const time = lst[lst.length-1]
    const anc = await element.$$('a')
    let link=null;
    for(let i of anc){
          const h22 = await i.$('h2')
          if(h22){
         link = i ? await page.evaluate(el => el.href, i) : null;
          }
         if (link!==null){
          break
         }
        
      }
    
    
    // Push the extracted data to the articles array
    if (title && author && date) {
      articles.push({ title, author, date:time, url:link});
    }
  
  }
  

  await browser.close();
  // console.log(articles)
  return articles;

}



module.exports = scrapeMedium;
