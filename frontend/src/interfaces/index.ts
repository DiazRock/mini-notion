import { Moment } from 'moment';
export interface Note {
    id: number;
    title: string;
    content: string;
    tags?: string[];
    username: string;
  }
  
export interface NoteFormValues {
    title: string; // Added to collect title in the form
    content: string;
    tags?: string[]; // Tags field for the form
  }
  
export interface Task {
    id?: number;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    due_date: Moment;
    status: 'Pending' | 'Progress' | 'Completed';
  }
  
export interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
  }
  
export interface RegisterFormValues {
    username: string;
    password: string;
  }
  
export interface LoginFormValues {
    username: string;
    password: string;
  }
  
export interface SearchResult {
    id: number;
    title: string;
    description?: string;
  }
  
export interface User {
    id: number;
    username: string;
    email: string;
  }
  

export interface TableProps<T> {
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    callBackShowNotification: (type: "success" | "error", message: string) => Promise<void>;
  }
