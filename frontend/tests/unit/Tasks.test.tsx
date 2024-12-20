import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tasks from '../../src/pages/Tasks';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { server } from '../../mocks/server';
import { DataMock } from '../../mocks/handlers';
import * as notificationHook from '../../src/utils/notificationHook';
import { http } from 'msw';

const API_URL = 
    process.env.REACT_APP_API_URL || 
    'http://localhost:3000';


describe('Tasks Component', () => {
    
    let mockShowNotification: jest.Mock;
    let mockOnClose: jest.Mock;
    beforeAll(() => {
        server.listen();
    })

    beforeEach(() => {
        DataMock.restartDataMock();
        const mockUseNotification = jest.spyOn(notificationHook, 'useNotification');
        mockShowNotification = jest.fn(); 
        mockUseNotification.mockReturnValue({
            showNotification: null,
            notification: null,
            callBackShowNotification: mockShowNotification
        });
        mockOnClose = jest.fn();
    });
    
    
    afterAll(() => {
        jest.clearAllMocks();
    });


    it('handles task addition', async () => {
        render(
            <Tasks
            />
        );

        const titleInput = screen.getByPlaceholderText('Task Title');
        const descriptionInput = screen.getByPlaceholderText('Task Description');
        const addButton = screen.getByRole('button', { name: /Add Task/i });

        // Fill in the form fields
        fireEvent.change(titleInput, { target: { value: 'Test Task' } });
        fireEvent.change(descriptionInput, { target: { value: 'This is a test task.' } });

        fireEvent.click(addButton);

        // Assert that handleSubmit was called with the correct values
        await waitFor(() => {
                expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
            });
       });

    
    it('fetches and displays tasks', async () => {
        
        render(
            <div>
                <MemoryRouter>
                    <Tasks />
                    <Routes>
                        <Route path="/tasks/:id" element={<></>} />
                    </Routes>
                </MemoryRouter>
            </div>
            
            
        );

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
        });
    });


    it('shows error message on failed task fetch', async () => {
        // Mock the GET request failure
        server.use(
            http.get(`${API_URL}/tasks`, () => {
                throw new Error('Failed to fetch tasks');
            })
        );

        render(
            <Tasks
            />
        );

        // Wait for the error message
        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('error', 'Failed to fetch tasks');
        });
    });
});
