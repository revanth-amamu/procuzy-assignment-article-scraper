import React, { useState } from 'react';
import './inputForm.css';

const InputForm = ({ onSubmit }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(topic);
    };

    return (
        <form onSubmit={handleSubmit} className="topic-form">
            <div className="input-group">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic"
                    className="input"
                    required
                />
                <button type="submit" className="button">
                    Scrape
                </button>
            </div>
        </form>
    );
};

export default InputForm;
