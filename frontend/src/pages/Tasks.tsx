import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, List } from 'antd';
import { Task, TaskFormValues, AddTaskModalProps } from  '../interfaces';
import axiosInstance from '../api';
import { useNotification } from '../utils/notificationHook';
import '../styles/Tasks.css';

const { TextArea } = Input;

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  visible, 
  onClose, 
  }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { notification, showNotification } = useNotification();

  const handleSubmit = async (values: TaskFormValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<{status: Number, body: Task}>('/tasks', 
        values, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      setTasks((prevTask) => [...prevTask, response.data.body]);
      showNotification('success', 'Task added successfully!');
      onClose();
    } catch (error) {
      showNotification('error', 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data.body);
    } catch (error) {
      showNotification('error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Modal
      title="Add New Task"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Form<TaskFormValues>
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input the task title!' }]}
        >
          <Input placeholder="Task Title" />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Please input the task description!' }]}
        >
          <TextArea placeholder="Task Description" rows={4} />
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
        renderItem={(task: Task) => 
        {
          return (
            <List.Item>
              {task.title}
              <br />
              {task.description}
            </List.Item>
          ) 
        }
        
      }
        className="task-form"
      />
    </Modal>
  );
};

export default AddTaskModal;
