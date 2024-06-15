const puppeteer = require('puppeteer');
require('dotenv').config();

const getTrendingBlogs = async (res, topic) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    });

    try {
        const page = await browser.newPage();
        const baseURL = 'https://medium.com';
        const topicURL = `${baseURL}/search?q=${topic.replace(" ", "-")}`;
        
        await page.goto(topicURL, { waitUntil: 'networkidle2' });

        const articles = await page.evaluate((baseURL) => {
            const articleTags = document.querySelectorAll('article');
            
            return Array.from(articleTags).map(article => {
                const titleTag = article.querySelector('h2');
                const title = titleTag ? titleTag.innerText.trim() : '';

                const authorTag = article.querySelector('.be');
                const author = authorTag ? authorTag.innerText.trim() : '';
                
                const linkTag = article.querySelector('.af');
                console.log(linkTag.length);
                const link = linkTag ? baseURL + linkTag.getAttribute('href') : '';

                const profileLinkTag = article.querySelector('a.au');
                const profileLink = profileLinkTag ? baseURL + profileLinkTag.getAttribute('href') : '';

                const readTimeTag = article.querySelector('a.au:nth-child(4)');
                const readTime = readTimeTag ? readTimeTag.innerText.split(' ')[0] : '';

                const uploadTag = article.querySelector('a.au:nth-child(3)');
                const uploadTagText = uploadTag ? uploadTag.innerText.trim() : '';

                return {
                    title,
                    author,
                    link,
                    profileLink,
                    readTime,
                    uploadTag: uploadTagText
                };
            });
        }, baseURL);

        res.json(articles);
    } catch (e) {
        console.error(e);
        res.status(500).send(`Something went wrong while running Puppeteer: ${e}`);
    } finally {
        await browser.close();
    }
};

module.exports = { getTrendingBlogs };

