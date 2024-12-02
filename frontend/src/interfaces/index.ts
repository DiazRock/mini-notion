export interface Note {
    id: number;
    content: string;
    title: string;
    user_id: 1;
}
  
export interface NoteFormValues {
    content: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    user_id: number;
  }
  
export interface TaskFormValues {
    title: string;
    description: string;
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

// Define the structure of search result items
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