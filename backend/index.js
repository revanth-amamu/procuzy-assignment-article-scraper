const express = require("express");
const cors = require("cors");
const { getTrendingBlogs } = require('./scraper');
const app = express();

app.use(express.json());
app.use(cors());

const port = 8080;

let articles = [];

app.post('/scrape', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        articles = await getTrendingBlogs(topic);
        res.json({ message: 'Scraping initiated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape Medium' });
    }
});

app.get('/articles', (req, res) => {
    res.json({ articles : articles.slice(0, 5) });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});