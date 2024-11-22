import React, { useState, useEffect } from 'react';
import { List, Typography, message } from 'antd';
import axios from 'axios';
import '../styles/ViewAll.css';

const { Title } = Typography;

const ViewAll = () => {
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [tasksResponse, notesResponse] = await Promise.all([
                    axios.get('/tasks'),
                    axios.get('/notes'),
                ]);
                setTasks(tasksResponse.data);
                setNotes(notesResponse.data);
            } catch (error) {
                message.error("Failed to fetch tasks and notes");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="viewall-container">
            <Title level={2}>View all tasks and notes</Title>
            <Title level={3}>Tasks</Title>
            <List
                bordered
                dataSource={tasks}
                renderItem={(task) => <List.Item>{task.title}</List.Item>}
                loading={loading}
            />
            <Title level={3}>Notes</Title>
            <List
                bordered
                dataSource={notes}
                renderItem={(note) => <List.Item>{note.content}</List.Item>}
                loading={loading}
            />
        </div>
    );
};

export default ViewAll;
