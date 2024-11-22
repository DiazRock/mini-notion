import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';  // To handle navigation
import TextEditor from '../components/TextEditor';
import TaskManager from '../components/TaskManager';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import '../styles/Navbar.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);

    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleSearch = (query) => {
        console.log(`Searching for: ${query}`);
        axios.get(`/search?query=${query}`).then(res => setSearchResults(res.data));
    };

    return (
        <Layout className="layout-container">
            <Header className="navbar-header">
                <div className="navbar-logo">
                    <Title level={3}>
                        <div className="navbar-title">
                            Mini-Notion
                        </div>
                    </Title>
                </div>
                <Menu mode="horizontal" theme="dark" className="navbar-menu">
                    <Menu.Item key="tasks">
                        <Link to="/tasks">Tasks</Link>
                    </Menu.Item>
                    <Menu.Item key="notes">
                        <Link to="/notes">Notes</Link>
                    </Menu.Item>
                    <Menu.Item key="view-all">
                        <Link to="/view-all">View All</Link>
                    </Menu.Item>
                </Menu>
                    
            </Header>
            <Content className="layout-content">
                <Outlet/>
            </Content>
        </Layout>
    );
};

export default Home;
