// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { Note, Task, User } from '../src/interfaces';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class DataMock {
  public static mockNotes: Note[];
  
  public static mockTasks: Task[];
  
  public static mockUser: User [];

  public static tokenPrefix: string;
  

  public static restartDataMock() {
    this.mockNotes = [
      { id: 1, 
        title: 'Note 1', 
        content: 'Content of note 1', 
        user_id: 1
      },
      { id: 2, 
        title: 'Note 2', 
        content: 'Content of note 2', 
        user_id: 1 
      }
    ];
    
    this.mockTasks = [
      { 
        id: 1, 
        title: 'Task 1', 
        description: 'Task 1 description', 
        user_id: 1 
      },
      { 
        id: 2, 
        title: 'Task 2', 
        description: 'Task 2 description', 
        user_id: 1 
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
      user_id: 1 
    };
    DataMock.mockNotes.push(newNote);
    return HttpResponse.json({
      status: 201,
      body: newNote
    });
  }),

  http.get(`${API_URL}/notes`, () => {
    return HttpResponse.json({
      status: 200,
      body: DataMock.mockNotes
    }); 
  }),

  http.delete(`${API_URL}/notes/:noteId`, (req: any) => {
    const { noteId } = req.params;
    const noteIndex = DataMock.mockNotes.findIndex(
        note => note.id === parseInt(noteId)
      );
    if (noteIndex === -1) {
      return HttpResponse.json({
        status: 404,
        body: { message: 'Note not found' }
      });
    }
    DataMock.mockNotes.splice(noteIndex, 1);
    return HttpResponse.json({
      status: 200,
      body: { message: 'Note deleted' }
    });
  }),

  // Tasks routes
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    console.log('Here in the post tasks route', request);
    const { title, description } = await request.json() as { title: string, description: string };
    const newTask: Task = { 
      id: DataMock.mockTasks.length + 1, 
      title, 
      description,
      user_id: 1
    };
    DataMock.mockTasks.push(newTask);
    return HttpResponse.json({
      status: 201,
      body: newTask
    });
  }),

  http.get(`${API_URL}/tasks`, () => {
    return HttpResponse.json({
      status: 200,
      body: DataMock.mockTasks
    });
  }),

  http.put(`${API_URL}/tasks/:taskId`, (req: any) => {
    const { taskId } = req.params;
    const { title, description } = req.body;
    const task = DataMock.mockTasks.find(
      task => task.id === parseInt(taskId)
    );
    if (!task) {
      return HttpResponse.json({
        status: 404,
        body: { message: 'Task not found' }
      });
    }
    task.title = title;
    task.description = description;
    return HttpResponse.json( {
      status: 200,
      body: task
    });
  }),

  http.delete(`${API_URL}/tasks/:taskId`, (req: any) => {
    const { taskId } = req.params;
    const taskIndex = DataMock.mockTasks.findIndex(
      task => task.id === parseInt(taskId)
    );
    if (taskIndex === -1) {
      return HttpResponse.json( {
        status: 404,
        body: { message: 'Task not found' }
      });
    }
    DataMock.mockTasks.splice(taskIndex, 1);
    return HttpResponse.json({
      status: 200,
      body: { message: 'Task deleted' }
    });
  }),

  // User profile route
  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json( {
      status: 200,
      body: DataMock.mockUser
    });
  }),
  // Auth route
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const { username, password } = await request.json() as 
            { username: string; password: string };
    
    if (username !== 'admin' || password !== 'password123') {
      return HttpResponse.json({
        status: 401,
        statusText: 'Invalid credentials'
      });
    }
    const token = `${DataMock.tokenPrefix}${username}`;
    
    return HttpResponse.json({
      status: 200,
      access_token: token
    });
  }),
];
