import React, { useState } from 'react';
import { Input } from 'antd';

const TextEditor = () => {
    const [content, setContent] = useState("");

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <Input.TextArea
            rows={10}
            value={content}
            onChange={handleChange}
            placeholder="Write your notes here..."
        />
    );
};

export default TextEditor;
