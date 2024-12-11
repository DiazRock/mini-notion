import React, { useEffect, useState } from 'react';
import { List, Input, Button, Typography, Form, Tag, Select, Space } from 'antd';
import axiosInstance from '../api';
import { Note, NoteFormValues } from '../interfaces';
import { useNotification } from '../utils/notificationHook';
import '../styles/Notes.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, callBackShowNotification } = useNotification();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get<Note[]>('/notes', { 
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        },
        );
        setNotes(response.data);
      } catch (error) {
        callBackShowNotification('error', 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    })();
  }, [callBackShowNotification]);

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

  const handleDeleteNote = async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      callBackShowNotification('success', 'Note deleted successfully!');
    } catch (error) {
      callBackShowNotification('error', 'Failed to delete note');
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
      <List
        bordered
        dataSource={notes}
        renderItem={(note) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteNote(note.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <div>
              <Title level={4}>{note.title}</Title>
              <p>{note.content}</p>
              <div>
                {note.tags?.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </List.Item>
        )}
        loading={loading}
      />
    </div>
  );
};

export default Notes;
