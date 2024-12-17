// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { Note, Task, User } from '../src/interfaces';
import moment from 'moment';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class DataMock {
  public static mockNotes: Note[];
  
  public static mockTasks: Task[];
  
  public static mockUser: User [];

  public static tokenPrefix: string;
  

  public static restartDataMock() {
    this.mockNotes = [
      {
        id: 1,
        title: 'Note 1',
        content: 'Content of note 1',
        username: 'username'
      },
      { id: 2, 
        title: 'Note 2', 
        content: 'Content of note 2', 
        username: 'username' 
      }
    ];
    
    this.mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Task 1 description',
        priority: 'High',
        due_date: moment(),
        status: 'Pending'
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Task 2 description',
        priority: 'High',
        due_date: moment(),
        status: 'Pending'
      }
    ];
    
    this.mockUser = [{ 
      id: 1, 
      username: 'testuser', 
      email: 'testuser@example.com' 
    }];
    
    this.tokenPrefix = 'mocked-token-';
  }
}

// Mock data for notes, tasks, and users
DataMock.restartDataMock();
// Mock handlers using http
export const handlers = [
  // Notes routes
  http.post(`${API_URL}/notes`, (req: any) => {
    const { title, content } = req.body;
    const newNote: Note = {
      id: DataMock.mockNotes.length + 1,
      title,
      content,
      username: 'username'
    };
    DataMock.mockNotes.push(newNote);
    return HttpResponse.json(newNote, {
      status: 201
    });
  }),

  http.get(`${API_URL}/notes`, () => {
    const mockNotes = DataMock.mockNotes;
    return HttpResponse.json(
      mockNotes
    );
  }),

  http.delete(`${API_URL}/notes/:noteId`, (req: any) => {
    const { noteId } = req.params;
    const noteIndex = DataMock.mockNotes.findIndex(
        note => note.id === parseInt(noteId)
      );
    if (noteIndex === -1) {
      return HttpResponse.json({
        message: 'Note not found'
      }, {
        status: 404
      });
    }
    DataMock.mockNotes.splice(noteIndex, 1);
    return HttpResponse.json({
      message: 'Note deleted',
    }, {
      status: 200
    });
  }),

  // Tasks routes
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title, description } = await request.json() as { title: string, description: string };
    const newTask: Task = {
      id: DataMock.mockTasks.length + 1,
      title,
      description,
      priority: 'High',
      due_date: moment(),
      status: 'Pending'
    };
    DataMock.mockTasks.push(newTask);
    return HttpResponse.json(newTask, {
      status: 201
    });
  }),

  http.get(`${API_URL}/tasks/`, () => {
    const mockTasks = DataMock.mockTasks
    return HttpResponse.json(
      mockTasks
    );
  }),

  http.put(`${API_URL}/tasks/:taskId`, (req: any) => {
    const { taskId } = req.params;
    const { title, description } = req.body;
    const task = DataMock.mockTasks.find(
      task => task.id === parseInt(taskId)
    );
    if (!task) {
      return HttpResponse.json(
        { message: 'Task not found' },
        {
          status: 404
        }
      );
    }
    task.title = title;
    task.description = description;
    return HttpResponse.json( task, 
      { status: 200 }
    );
  }),

  http.delete(`${API_URL}/tasks/:taskId`, (req: any) => {
    const { taskId } = req.params;
    const taskIndex = DataMock.mockTasks.findIndex(
      task => task.id === parseInt(taskId)
    );
    if (taskIndex === -1) {
      return HttpResponse.json( 
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    DataMock.mockTasks.splice(taskIndex, 1);
    return HttpResponse.json({ message: 'Task deleted' },
      { status: 200 }
    );
  }),
  // Auth route
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const { username, password } = await request.json() as 
            { username: string; password: string };
    
    if (username !== 'admin' || password !== 'password123') {
      return HttpResponse.json({
        statusText: 'Invalid credentials'
      }, {
        status: 401
      });
    }
    const token = `${DataMock.tokenPrefix}${username}`;
    
    return HttpResponse.json({
      access_token: token
    }, {
      status: 200
    });
  }),
];
