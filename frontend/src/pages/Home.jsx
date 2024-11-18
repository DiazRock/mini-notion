import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import TextEditor from '../components/TextEditor';
import TaskManager from '../components/TaskManager';
import SearchBar from '../components/SearchBar';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        // Search functionality
        console.log(`Searching for: ${query}`);
        //
        axios.get(`/search?query=${query}`).then(res => setSearchResults(res.data));
    };

    return (
        <Layout className="layout-container">
            <Header className="header">
                <Title className="title" level={3}>
                    Mini-Notion
                </Title>
            </Header>
            <Layout>
                <Sider width={200} className="layout-sider">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        className="sider-menu"
                    >
                        <Menu.Item key="1">Tasks</Menu.Item>
                        <Menu.Item key="2">Notes</Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content className="layout-content">
                        <SearchBar onSearch={handleSearch} />
                        <div className="search-bar-container">
                            <TaskManager />
                            <TextEditor />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Home;
