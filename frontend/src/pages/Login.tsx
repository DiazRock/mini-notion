import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axiosInstance from '../api';
import { Link } from 'react-router-dom';
import { LoginFormValues } from '../interfaces';
import { useNotification } from '../utils/notificationHook';
import '../styles/Login.css';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const { notification, showNotification } = useNotification();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post<{ status: number, token: string }>("/auth/login", values);
      if (response.data.status === 200) {
        showNotification('success', "Login successful!");
        localStorage.setItem("token", response.data.token); // Store the token in localStorage
        window.location.href = "/"; // Redirect to home after login
      }
      else if (response.data.status === 401) {
        showNotification('error', "Login failed. Please enter your credentials and try again");
      }
      
    } catch (error) {
      showNotification('error', "Login failed due to server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
