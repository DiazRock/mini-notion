import React, { useState, useEffect } from 'react';
import { List, Tag, Typography } from 'antd';
import TaskTable from '../components/TaskTable';
import NoteTable from '../components/NoteTable';
import { Note, Task } from '../interfaces';
import axiosInstance from '../api';
import { useNotification } from '../utils/notificationHook';
import '../styles/ViewAll.css';

const { Title } = Typography;


const ViewAll: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [notes, setNotes] = useState<Note[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, callBackShowNotification } = useNotification();

  return (
    <div className="viewall-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Title level={2}>View all tasks and notes</Title>

      <Title level={3}>Tasks</Title>
      <TaskTable 
        data={tasks} 
        setData={setTasks} 
        setLoading={setLoading} 
        callBackShowNotification={ callBackShowNotification }      
      />

      <Title level={3}>Notes</Title>
      <NoteTable 
        data = {notes} 
        setData = {setNotes}
        setLoading = {setLoading}
        callBackShowNotification = { callBackShowNotification }
      />
    </div>
  );
};

export default ViewAll;
