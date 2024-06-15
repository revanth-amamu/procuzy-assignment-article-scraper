import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Articles from './components/Articles';
import './App.css';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [articlesNotFound, setArticlesNotFound] = useState(false);

    const fetchArticles = async (topic) => {
        setLoading(true);
        try {
            // Post the topic to the backend
            const scrapeResponse = await fetch(`${baseUrl}/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });
    
            if (!scrapeResponse.ok) {
                throw new Error('Failed to post topic.');
            }
    
            // Wait for a few seconds to allow scraping to complete
            await new Promise(resolve => setTimeout(resolve, 5000));
    
            // Fetch the articles from the backend
            const articlesResponse = await fetch(`${baseUrl}/articles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!articlesResponse.ok) {
                throw new Error('Failed to fetch articles.');
            }
    
            const data = await articlesResponse.json();
    
            console.log(data);
    
            if (data.articles.length === 0) {
                setArticles([]);
                setArticlesNotFound(true);
            } else {
                setArticles(data.articles);
                setArticlesNotFound(false);
                alert("Articles fetched successfully.");
            }
        } catch (error) {
            console.log({msg: error.message});
            alert("Error fetching articles. Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="App">
            <header className="App-header">
                <h1>Medium Article Scraper</h1>
            </header>
            <InputForm onSubmit={fetchArticles} />
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="articles-container">
                    {articlesNotFound ? (
                        <div className="no-articles">
                            <p>No articles found for the entered topic.</p>
                        </div>
                    ) : (
                        <Articles articles={articles} />
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
