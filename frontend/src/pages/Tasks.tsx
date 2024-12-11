import React, { useEffect, useState } from 'react';
import { Button, Input, Form, List, Checkbox, Select, DatePicker } from 'antd';
import { Task, TaskFormValues } from '../interfaces';
import axiosInstance from '../api';
import { useNotification } from '../utils/notificationHook';
import '../styles/Tasks.css';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, callBackShowNotification } = useNotification();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<{ status: number; body: Task[] }>('/tasks');
        setTasks(response.data.body);
      } catch (error) {
        callBackShowNotification('error', 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    })();
  }, [callBackShowNotification]);

  const handleAddTask = async (values: TaskFormValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/tasks', values);
      setTasks((prevTasks) => [...prevTasks, response.data.body]);
      callBackShowNotification('success', 'Task added successfully!');
    } catch (error) {
      callBackShowNotification('error', 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (taskId: number, isCompleted: boolean): Promise<void> => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, { is_completed: isCompleted });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, is_completed: isCompleted } : task))
      );
    } catch (error) {
      callBackShowNotification('error', 'Failed to update task status');
    }
  };

  return (
    <div className="tasks-container">
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <Form<TaskFormValues> layout="vertical" onFinish={handleAddTask}>
        <Form.Item name="title" rules={[{ required: true, message: 'Please input the task title!' }]}>
          <Input placeholder="Task Title" />
        </Form.Item>
        <Form.Item name="description" rules={[{ required: true, message: 'Please input the task description!' }]}>
          <TextArea placeholder="Task Description" rows={4} />
        </Form.Item>
        <Form.Item name="priority" rules={[{ required: true, message: 'Please select the priority!' }]}>
          <Select placeholder="Select Priority">
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item name="due_date">
          <DatePicker placeholder="Due Date" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Task
          </Button>
        </Form.Item>
      </Form>
      <List
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <Checkbox
              checked={task.is_completed}
              onChange={(e) => toggleCompletion(task.id, e.target.checked)}
            >
              {task.title}
            </Checkbox>
            <div>Priority: {task.priority}</div>
            <div>Due Date: {task.due_date ? moment(task.due_date).format('YYYY-MM-DD') : 'None'}</div>
            <div>{task.description}</div>
            <div>{task.status}</div>
          </List.Item>
        )}
        loading={loading}
      />
    </div>
  );
};

export default Tasks;
