import React, { useState, useEffect } from 'react';
import { List, Typography } from 'antd';
import { Note, Task } from '../interfaces';
import axiosInstance from '../api';
import { useNotification } from '../utils/notificationHook';
import '../styles/ViewAll.css';

const { Title } = Typography;


const ViewAll: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [notes, setNotes] = useState<Note[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        
        const [tasksResponse, notesResponse] = await Promise.all([
          axiosInstance.get<{status: Number, body: Task[]}>('/tasks'),
          axiosInstance.get<{status: Number, body: Note[]}>('/notes'),
        ]);
        setTasks(tasksResponse.data.body);
        setNotes(notesResponse.data.body);
      } catch (error) {
        showNotification('error', 'Failed to fetch tasks and notes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="viewall-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Title level={2}>View all tasks and notes</Title>

      <Title level={3}>Tasks</Title>
      <List
        bordered
        dataSource={tasks}
        renderItem={(task: Task) => <List.Item>{task.title}</List.Item>}
        loading={loading}
      />

      <Title level={3}>Notes</Title>
      <List
        bordered
        dataSource={notes}
        renderItem={(note: Note) => <List.Item>{note.content}</List.Item>}
        loading={loading}
      />

      
    </div>
  );
};

export default ViewAll;
