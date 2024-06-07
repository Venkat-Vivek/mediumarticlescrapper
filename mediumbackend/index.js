const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const scrapeMedium = require('./scraper');


let articles = [];

app.post('/scrape', async (req, res) => {
    const { topic } = req.body;
    articles=[]
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }
    // const topicc='Meat'
    articles = await scrapeMedium(topic);
    articles = articles.slice(0,5)
    console.log(topic)
    if (articles.length === 0) {
        return res.status(500).json({ error: 'No articles found or scraping failed' });
    }

    res.json('Success');
});

app.get('/articles', (req, res) => {
    // console.log('hi')
    // console.log(articles)
    res.json(articles);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  

