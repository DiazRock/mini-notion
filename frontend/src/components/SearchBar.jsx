import React, { useState } from 'react';
import { Input } from 'antd';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (value) => {
        setQuery(value);
        onSearch(value); // Pass the query to the parent component for handling
    };

    return (
        <Input.Search
            placeholder="Search tasks or notes..."
            value={query}
            onSearch={handleSearch}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
            style={{ width: 300 }}
        />
    );
};

export default SearchBar;
