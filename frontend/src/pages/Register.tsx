import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axiosInstance from '../api';
import { RegisterFormValues } from '../interfaces';
import { Link } from 'react-router-dom';
import { useNotification } from '../utils/notificationHook';
import '../styles/Auth.css';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, showNotification } = useNotification();

  const handleRegister = async (values: RegisterFormValues): Promise<void> => {
    try {
      setLoading(true);
      const { username, password } = values;
      await axiosInstance.post("/auth/register", { username, password });
      showNotification('success', "Registration successful! You can now log in.");
      window.location.href = "/"; // Redirect to login after successful registration
    } catch (error) {
      showNotification('error', "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
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
          rules={[
            { required: true, message: "Please input your password!" },
            {
              min: 8,
              message: "Password must be at least 8 characters long.",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
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
