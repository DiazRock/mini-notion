import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axiosInstance from '../api';
import { RegisterFormValues } from '../interfaces';
import { Link } from 'react-router-dom';
import { useNotification } from '../utils/notificationHook';
import '../styles/Register.css';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, showNotification } = useNotification();

  const handleRegister = async (values: RegisterFormValues): Promise<void> => {
    try {
      setLoading(true);
      await axiosInstance.post("/auth/register", values);
      showNotification('success', "Registration successful! You can now log in.");
      window.location.href = "/login"; // Redirect to login after successful registration
    } catch (error) {
      showNotification('error', "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Title level={2}>Register</Title>
      <Form<RegisterFormValues>
        layout="vertical"
        onFinish={handleRegister}
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
            Register
          </Button>
        </Form.Item>
      </Form>
      <div>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
