import React, { useState } from 'react';
import { Input, Button, Typography, Form, Select } from 'antd';
import axiosInstance from '../api';
import { Note, NoteFormValues } from '../interfaces';
import NoteTable from '../components/NoteTable';
import { useNotification } from '../utils/notificationHook';
import '../styles/Notes.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, callBackShowNotification } = useNotification();

  const handleAddNote = async (values: Note): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/notes', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes((prevNotes) => [...prevNotes, response.data]);
      callBackShowNotification('success', 'Note added successfully!');
    } catch (error) {
      callBackShowNotification('error', 'Failed to add note');
    }
  };

  return (
    <div className="notes-container">
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <Title level={2}>Notes</Title>

      <Form<NoteFormValues> layout="vertical" onFinish={handleAddNote} className="note-form">
        <Form.Item name="title" rules={[{ required: true, message: 'Please input the note title!' }]}>
          <Input placeholder="Note Title" />
        </Form.Item>
        <Form.Item name="content" rules={[{ required: true, message: 'Please input note content!' }]}>
          <TextArea placeholder="Write your note here..." rows={4} />
        </Form.Item>
        <Form.Item name="tags">
          <Select mode="tags" placeholder="Add tags">
            <Option value="Personal">Personal</Option>
            <Option value="Work">Work</Option>
            <Option value="Idea">Idea</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Note
          </Button>
        </Form.Item>
      </Form>

      <NoteTable
        data={notes}
        setData={setNotes}
        callBackShowNotification={callBackShowNotification}
        setLoading={setLoading}
      />
    </div>
  );
};

export default Notes;
