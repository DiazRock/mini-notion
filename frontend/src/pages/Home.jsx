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
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ background: "#001529", color: "#fff", padding: "0 16px" }}>
                <Title style={{ color: "#fff", margin: 0 }} level={3}>
                    Mini-Notion
                </Title>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: "#fff" }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        style={{ height: "100%" }}
                    >
                        <Menu.Item key="1">Tasks</Menu.Item>
                        <Menu.Item key="2">Notes</Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: "16px" }}>
                        <SearchBar onSearch={handleSearch} />
                        <div style={{ marginTop: "16px" }}>
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
