import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from '../api/api';

const { Title } = Typography;

const Login = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post("/auth/login", values);
            message.success("Login successful!");
            localStorage.setItem("token", response.data.token);
            onLogin(); // Notify parent component about successful login
        } catch (error) {
            message.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <Title level={2}>Login</Title>
            <Form
                layout="vertical"
                onFinish={handleLogin}
                style={{ marginTop: 16 }}
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
        </div>
    );
};

export default Login;
