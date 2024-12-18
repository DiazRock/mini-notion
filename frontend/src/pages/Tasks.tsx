import React, { useState } from 'react';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import { Task } from '../interfaces';
import axiosInstance from '../api';
import { useNotification } from '../utils/notificationHook';
import TaskTable from '../components/TaskTable';
import moment from 'moment';


const { TextArea } = Input;
const { Option } = Select;

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, callBackShowNotification } = useNotification();

  const handleAddTask = async (values: Task): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/tasks',
        {
          ...values,
          due_date: values.due_date.format('YYYY-MM-DD'),
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
      callBackShowNotification('success', 'Task added successfully!');
    } catch (error) {
      callBackShowNotification('error', 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <Form<Task> layout="vertical" onFinish={handleAddTask}>
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
        <Form.Item name="status" rules={[{ required: true, message: 'Please choose a status' }]}>
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="Progress">Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item name="due_date" rules={[{ required: true, message: 'Please select a due date' }]}>
          <DatePicker 
            placeholder="Due Date" 
            format="YYYY-MM-DD" 
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Task
          </Button>
        </Form.Item>
      </Form>
      <TaskTable
        data={tasks}
        setData={setTasks}
        setLoading={setLoading}
        callBackShowNotification={callBackShowNotification}
        />
    </>
  );
};

export default Tasks;
