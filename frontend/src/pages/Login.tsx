import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axiosInstance from '../api';
import { Link } from 'react-router-dom';
import { LoginFormValues } from '../interfaces';
import { useNotification } from '../utils/notificationHook';
import '../styles/Auth.css';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, showNotification } = useNotification();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<{ status: number, access_token: string }>("/auth/login", values);
      showNotification('success', "Login successful!");
      localStorage.setItem("token", response.data.access_token);
      window.location.href = "/"; // Redirect to home after login
      
    } catch (error) {
      if (error.status === 401) {
        showNotification('error', "Login failed. Please enter your credentials and try again");
      }
      else if (error.status === 500) {
        showNotification('error', "Login failed due to server error.");
      } else {
        showNotification('error', "An unexpected error occurred while trying to login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Title level={2}>Login</Title>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Form<LoginFormValues>
        layout="vertical"
        onFinish={handleLogin}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <div>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
