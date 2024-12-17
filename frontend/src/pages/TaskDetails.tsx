import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Task } from '../interfaces';
import axiosInstance from '../api';
import { Spin, Button } from 'antd';
import '../styles/TaskDetails.css';
import moment from 'moment';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`/tasks/${id}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.error('Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spin />;

  if (!task) return <div>No task found</div>;

  return (
    <div className="task-details">
      <h1>Task Details</h1>
      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Due Date:</strong> {moment(task.due_date).format('YYYY-MM-DD')}</p>
      <Link to="/tasks">
        <Button type="primary">Back to Tasks</Button>
      </Link>
    </div>
  );
};

export default TaskDetails;
