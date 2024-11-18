import React, { useState, useEffect } from 'react';
import { List, Button, Input } from 'antd';
import axios from '../api/api';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        const response = await axios.get("/tasks");
        setTasks(response.data);
    };

    const addTask = async () => {
        await axios.post("/tasks", { title: newTask });
        setNewTask("");
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New Task"
            />
            <Button onClick={addTask}>Add Task</Button>
            <List
                bordered
                dataSource={tasks}
                renderItem={(task) => (
                    <List.Item>
                        {task.title}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default TaskManager;
