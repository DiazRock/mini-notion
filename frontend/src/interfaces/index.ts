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
    id: number;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low'; // Added priority levels
    due_date?: string; // Optional due date
    is_completed: boolean; // To track completion status
    user_id: number;
    status: 'Pending' | 'In Progress' | 'Completed'; // Added status levels
  }
  
  export interface TaskFormValues {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low'; // Required priority
    due_date?: string; // Optional due date
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
    id: number; // Replace with the actual structure of your search results
    title: string;
    description?: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
  }
  