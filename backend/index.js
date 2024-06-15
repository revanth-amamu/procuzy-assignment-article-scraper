const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { getTrendingBlogs } = require('./scraper');
const app = express();

app.use(express.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    next();
});

const port = process.env.PORT || 8000;

let articles = [];

app.post('/scrape', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }
    try {
        articles = await getTrendingBlogs(res, topic);
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