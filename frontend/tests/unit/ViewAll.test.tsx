import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ViewAll from '../../src/pages/ViewAll';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../mocks/server';
import { http } from 'msw';


const API_URL = 
    process.env.REACT_APP_API_URL || 
    'http://localhost:3000';

// Set up and tear down the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ViewAll Component', () => {
    it('fetches and displays tasks and notes', async () => {
        render(
            <MemoryRouter initialEntries={['/view-all']}>
                <ViewAll />
            </MemoryRouter>
        );

        // Verify loading state
        expect(screen.getByText(/View all tasks and notes/i)).toBeInTheDocument();

        // Verify tasks and notes after fetching
        await waitFor(() => {
            expect(screen.getAllByText(/Task 1/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Task 2/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Note 1/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Note 2/i)[0]).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Override the default handlers to simulate errors
        server.use(
            http.get(`${API_URL}/tasks`, () => {
                throw new Error('Failed to fetch tasks');
            }),
            http.get(`${API_URL}/notes`, () => {
                throw new Error('Failed to fetch notes');
            })
        );

        render(
            <MemoryRouter initialEntries={['/view-all']}>
                <ViewAll />
            </MemoryRouter>
            
        );

        // Wait for error messages to appear
        await waitFor(() => {

            expect(
                screen
                .getByText(/Failed to fetch notes/i))
                .toBeInTheDocument();
        });
    });
});
