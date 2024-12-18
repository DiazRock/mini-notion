import React, { useState } from 'react';
import { Layout, Menu, Typography, Input, Table } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // For navigation
import { SearchResult } from '../interfaces';
import axiosInstance from '../api';
import '../styles/Navbar.css';
import '../styles/Home.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (query: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get<SearchResult[]>(
        `/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const clearSearchResults = (): void => {
    setSearchResults([]);
    setSearchQuery('');
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <strong>{type}</strong>, // Bold type
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
  ];

  return (
    <Layout className="layout-container">
      {/* Navbar */}
      <Header className="navbar-header">
        <div className="navbar-logo">
          <Title level={3}>
            <div className="navbar-title">Mini-Notion</div>
          </Title>
        </div>
        <Menu mode="horizontal" theme="dark" className="navbar-menu">
          <Menu.Item key="tasks" onClick={clearSearchResults}>
            <Link to="/tasks">Tasks</Link>
          </Menu.Item>
          <Menu.Item key="notes" onClick={clearSearchResults}>
            <Link to="/notes">Notes</Link>
          </Menu.Item>
          <Menu.Item key="view-all" onClick={clearSearchResults}>
            <Link to="/view-all">View All</Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={() => { handleLogout(); clearSearchResults(); }}>
            Logout
          </Menu.Item>
        </Menu>
      </Header>

      <Content className="layout-content">
        {/* Search Bar */}
        <div style={{ padding: '20px' }}>
          <Search
            placeholder="Search for notes or tasks..."
            onSearch={handleSearch}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            enterButton="Search"
            size="large"
          />
        </div>

        {/* Render Search Results or Outlet */}
        {searchResults.length > 0 ? (
          <>
            <Title level={4}>Search Results</Title>
            <Table
              columns={columns}
              dataSource={searchResults.map((result) => ({
                ...result,
                key: result.id,
              }))}
              pagination={{ pageSize: 5 }}
            />
          </>
        ) : (
          <Outlet />
        )}
      </Content>
    </Layout>
  );
};

export default Home;
