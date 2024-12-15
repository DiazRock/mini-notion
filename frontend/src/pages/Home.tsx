import React, { useState } from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // To handle navigation
import { SearchResult } from '../interfaces';
import axiosInstance from '../api';
import '../styles/Navbar.css';
import '../styles/Home.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // Array of search results
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // Drawer visibility state
  const navigate = useNavigate(); // Hook to programmatically navigate

  const toggleDrawer = (): void => {
    setDrawerVisible(!drawerVisible);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  const handleSearch = async (query: string): Promise<void> => {
    console.log(`Searching for: ${query}`);
    try {
      const response = await axiosInstance.get<SearchResult[]>(`/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <Layout className="layout-container">
      <Header className="navbar-header">
        <div className="navbar-logo">
          <Title level={3}>
            <div className="navbar-title">Mini-Notion</div>
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
          <Menu.Item key="logout" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="layout-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default Home;
