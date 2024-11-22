import React, { useState } from 'react';
import { List, Input, Button, Typography, Form, message } from 'antd';
import axios from '../api/api';
import '../styles/Tasks.css';

const { Title } = Typography;

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            message.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (values) => {
        try {
            const response = await axios.post('/tasks', values);
            setTasks([...tasks, response.data]);
            message.success("Task added successfully!");
        } catch (error) {
            message.error("Failed to add task");
        }
    };

    return (
        <div className="tasks-container">
            <Title level={2}>Tasks</Title>
            <Form
                layout="inline"
                onFinish={handleAddTask}
                className="task-form"
            >
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: "Please input a task title!" }]}
                >
                    <Input placeholder="New Task" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Task
                    </Button>
                </Form.Item>
            </Form>
            <Button 
                onClick={fetchTasks} 
                loading={loading}
                className='task-button'
            >
                Refresh Tasks
            </Button>
            <List
                bordered
                dataSource={tasks}
                renderItem={(task) => <List.Item>{task.title}</List.Item>}
                className='task-form'
            />
        </div>
    );
};

export default Tasks;
