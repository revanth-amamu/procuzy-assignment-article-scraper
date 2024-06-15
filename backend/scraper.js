const puppeteer = require('puppeteer');

const baseURL = 'https://medium.com';

const getTrendingBlogs = async (topic) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const topicURL = `${baseURL}/search?q=${topic.replace(" ", "-")}`;
    
    await page.goto(topicURL, { waitUntil: 'networkidle2' });

    const articles = await page.evaluate(() => {
        const articleTags = document.querySelectorAll('article');
        
        return Array.from(articleTags).map(article => {
            const titleTag = article.querySelector('h2');
            const title = titleTag ? titleTag.innerText.trim() : '';

            const authorTag = article.querySelector('be b ik z ee hl ef eg eh ei ej ek bj');
            const author = authorTag ? authorTag.innerText.trim() : '';
            
            const linkTag = article.querySelector('a.au');
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
    });

    await browser.close();
    return articles;
};

module.exports = { getTrendingBlogs };
