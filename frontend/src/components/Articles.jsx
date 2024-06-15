import React from 'react';
import './articles.css';

const Articles = ({ articles }) => {
    return (
        <div className="grid">
            {articles.map((article, index) => (
                <div key={index} className="article-box">
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-author">By: {article.author || 'Unknown Author'}</p>
                    <p className="article-date">Published: {article.pubDate}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link">
                        <button className="view-button">View</button>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Articles;
