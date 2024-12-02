import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notes from '../../src/pages/Notes';
import { server } from '../../mocks/server';
import * as notificationHook from '../../src/utils/notificationHook';
import { http } from 'msw';

const API_URL = 
    process.env.REACT_APP_API_URL || 
    'http://localhost:3000';


describe('Notes Component', () => {

    let mockShowNotification: jest.Mock;
    beforeAll(() => {
        const mockUseNotification = jest.spyOn(notificationHook, 'useNotification');
        mockShowNotification = jest.fn(); 
        mockUseNotification.mockReturnValue({
            showNotification: mockShowNotification,
            notification: null
        })
    })

    afterAll(() => {
        jest.clearAllMocks();
    })

    it('handles note addition', async () => {
        render(<Notes />);

        fireEvent.change(screen.getByPlaceholderText(/write your note here/i), { target: { value: 'New Note' } });
        fireEvent.click(screen.getByRole('button', { name: /add note/i }));

        await waitFor(() => {
            expect(screen.getByText('New Note')).toBeInTheDocument();
        });
    });

    it('shows error message on failed note fetch', async () => {

        // Mockings

        server.use(
            http.get(`${API_URL}/notes`, () => {
                throw new Error('Failed to fetch notes');
            })
        );

        // End of mockings
        render(<Notes />);

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('error', 'Failed to fetch notes');
        });
    });

    it('shows error message on failed note addition', async () => {

        // Mockings
        server.use(
            http.post(`${API_URL}/notes`, () => {
                throw new Error('Failed to add note');
            })
        );

        // End of mockings
        
        render(<Notes />);

        const placeholder = screen.getByPlaceholderText(/write your note here/i);
        const addNoteButton = screen.getByRole('button', { name: /add note/i })

        fireEvent.change(placeholder, { target: { value: 'New Note' } });
        fireEvent.click(addNoteButton);

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('error', 'Failed to add note');
        });
    });
});
