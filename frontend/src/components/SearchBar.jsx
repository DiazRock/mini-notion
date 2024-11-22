import React, { useState } from 'react';
import { Input } from 'antd';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (value) => {
        setQuery(value);
        onSearch(value);
    };

    return (
        <Input.Search
            className="search-input"
            placeholder="Search tasks or notes..."
            value={query}
            onSearch={handleSearch}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
        />
    );
};

export default SearchBar;
