import React, { useEffect } from "react";
import { Button, Checkbox, Table } from "antd";
import { Task, TableProps } from "../interfaces";
import axiosInstance from '../api';
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { Link } from "react-router-dom";

const TaskTable: React.FC<TableProps<Task>> = ({ 
        data,
        setData, 
        callBackShowNotification,
    }) => {
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(
                    '/tasks/', {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                        },
                    });
                setData(response.data);
            } catch (error) {
                callBackShowNotification('error', 'Failed to fetch tasks');
            } finally {
            }
        })();
    }, [callBackShowNotification, setData]);

    const toggleCompletion = async (taskId: number): Promise<void> => {
        try {
        const token = localStorage.getItem('token');
        await axiosInstance.put(
            `/tasks/${taskId}?status=Completed`,
            {},
            {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            }
        );
        setData((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'Completed' } : task))
        );
        } catch (error) {
        callBackShowNotification('error', 'Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId: number): Promise<void> => {
        try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/tasks/${taskId}`, {
            headers: {
            Authorization: 'Bearer ' + token,
            },
        });
        setData((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        callBackShowNotification('success', 'Task deleted successfully!');
        } catch (error) {
        callBackShowNotification('error', 'Failed to delete task');
        }
    };

    const columns: ColumnsType<Task> = [
        {
            title: 'Completed',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: Task) => (
                <Checkbox
                checked={record.status === 'Completed'}
                onChange={() => toggleCompletion(record.id)}
                />
            ),
        },
            {
                title: 'Task',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Priority',
                dataIndex: 'priority',
                key: 'priority',
            },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (dueDate: string) => (dueDate ? moment(dueDate).format('YYYY-MM-DD') : 'None'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Task) => (
                <div>
                <Link to={`/tasks/${record.id}`}>View Details</Link>
                <Button type="primary" danger onClick={() => handleDeleteTask(record.id)} style={{ marginLeft: '10px' }}>
                    Delete
                </Button>
                </div>
            ),
        },
    ];

    return <Table<Task> 
                dataSource={data} 
                columns={columns} 
                rowKey="id"
                bordered pagination={{ pageSize: 5 }} 
            />;
};

export default TaskTable;
