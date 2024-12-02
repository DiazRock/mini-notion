import React, { useEffect, useState } from 'react';
import { List, Input, Button, Typography, Form, message } from 'antd';
import axiosInstance from '../api';
import { Note, NoteFormValues } from '../interfaces';
import { useNotification } from '../utils/notificationHook';
import '../styles/Notes.css';

const { Title } = Typography;
const { TextArea } = Input;


const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, showNotification } = useNotification();

  const fetchNotes = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Note[]>('/notes');
      setNotes(response.data);
    } catch (error) {
      showNotification('error', 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (values: NoteFormValues): Promise<void> => {
    try {
      const response = await axiosInstance.post<Note>('/notes', values); // Assuming the API returns the created note
      setNotes((prevNotes) => [...prevNotes, response.data]);
      showNotification('success', 'Note added successfully!');
    } catch (error) {
      showNotification('error', 'Failed to add note');
    }
  };

  return (
    <div className="notes-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Title level={2}>Notes</Title>
      <Form<NoteFormValues>
        layout="vertical"
        onFinish={handleAddNote}
        className="note-form"
      >
        <Form.Item
          name="content"
          rules={[{ required: true, message: 'Please input note content!' }]}
        >
          <TextArea placeholder="Write your note here..." rows={4} />
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
        renderItem={(note: Note) => {
            return (
                    <List.Item>
                        {note.title}
                        <br />
                        {note.content}
                    </List.Item>
                )
            }
        }
        className="note-form"
      />
    </div>
  );
};

export default Notes;
