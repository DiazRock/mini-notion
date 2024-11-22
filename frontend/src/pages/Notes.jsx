import React, { useState } from 'react';
import { List, Input, Button, Typography, Form, message } from 'antd';
import axios from 'axios';
import '../styles/Notes.css';

const { Title } = Typography;
const { TextArea } = Input;

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/notes');
            setNotes(response.data);
        } catch (error) {
            message.error("Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (values) => {
        try {
            const response = await axios.post('/notes', values);
            setNotes([...notes, response.data]);
            message.success("Note added successfully!");
        } catch (error) {
            message.error("Failed to add note");
        }
    };

    return (
        <div className="notes-container">
            <Title level={2}>Notes</Title>
            <Form
                layout="vertical"
                onFinish={handleAddNote}
                className="note-form"
            >
                <Form.Item
                    name="content"
                    rules={[{ required: true, message: "Please input note content!" }]}
                >
                    <TextArea placeholder="Write your note here..." rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Note
                    </Button>
                </Form.Item>
            </Form>
            <Button 
                onClick={fetchNotes} 
                loading={loading} 
                className='note-button'
            >
                Refresh Notes
            </Button>
            <List
                bordered
                dataSource={notes}
                renderItem={(note) => <List.Item>{note.content}</List.Item>}
                className="note-form"
            />
        </div>
    );
};

export default Notes;
