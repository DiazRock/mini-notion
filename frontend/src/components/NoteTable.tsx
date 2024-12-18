import React, { useEffect } from "react";
import { Note, TableProps } from "../interfaces";
import axiosInstance from '../api';
import { Button, Space, Table, Tag } from "antd";


const NoteTable: React.FC<TableProps<Note>> = ( {
    data,
    setData,
    callBackShowNotification
} ) => {

    const handleDeleteNote = async (id: number): Promise<void> => {
        try {
          const token = localStorage.getItem('token');
          await axiosInstance.delete(`/notes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData((prevNotes) => prevNotes.filter((note) => note.id !== id));
          callBackShowNotification('success', 'Note deleted successfully!');
        } catch (error) {
          callBackShowNotification('error', 'Failed to delete note');
        }
    };
    const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Content',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: 'Tags',
          dataIndex: 'tags',
          key: 'tags',
          render: (tags: string[]) => (
            <Space>
              {tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          ),
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_: any, record: Note) => (
            <Button type="primary" danger onClick={() => handleDeleteNote(record.id)}>
              Delete
            </Button>
          ),
        },
      ];

    useEffect(() => {
        (async (): Promise<void> => {
          try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get<Note[]>('/notes', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setData(response.data);
          } catch (error) {
            callBackShowNotification('error', 'Failed to fetch notes');
          } finally {
          }
        })();
      }, [callBackShowNotification, setData]);

    return (
        <Table
            bordered
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
        />
    )
}

export default NoteTable;