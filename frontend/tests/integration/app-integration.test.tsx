import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';


describe('App Integration Tests', () => {
    it('renders login page and navigates to home after login', async () => {
        render(
            <App />
        );

        // Check login page
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Simulate successful login
        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeTruthy();
            expect(screen.getByText(/mini-notion/i)).toBeInTheDocument(); // Home Page
        });
    });

    it('loads tasks and adds a new task', async () => {
        render(
            <App />
        );

        // Simulate login
        localStorage.setItem('token', 'mock-token');
        fireEvent.click(screen.getByText(/tasks/i)); // Navigate to Tasks page

        // Verify tasks are loaded
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });

        // Add a new task
        fireEvent.change(screen.getByPlaceholderText(/new task/i), { target: { value: 'New Task' } });
        fireEvent.click(screen.getByRole('button', { name: /add task/i }));

        // Verify the new task is added
        await waitFor(() => {
            expect(screen.getByText('New Task')).toBeInTheDocument();
        });
    });

    it('loads notes and adds a new note', async () => {
        render(
            <>
                <App />
            </>
        );

        // Simulate login
        localStorage.setItem('token', 'mock-token');
        fireEvent.click(screen.getByText(/notes/i)); // Navigate to Notes page

        // Verify notes are loaded
        await waitFor(() => {
            expect(screen.getByText('Note 1')).toBeInTheDocument();
            expect(screen.getByText('Note 2')).toBeInTheDocument();
        });

        // Add a new note
        fireEvent.change(screen.getByPlaceholderText(/write your note here/i), { target: { value: 'New Note' } });
        fireEvent.click(screen.getByRole('button', { name: /add note/i }));

        // Verify the new note is added
        await waitFor(() => {
            expect(screen.getByText('New Note')).toBeInTheDocument();
        });
    });

    it('displays tasks and notes together on the "View All" page', async () => {
        render(
            <>
                <App />
            </>
        );

        // Simulate login
        localStorage.setItem('token', 'mock-token');
        fireEvent.click(screen.getByText(/view all/i)); // Navigate to View All page

        // Verify tasks and notes are displayed
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Note 1')).toBeInTheDocument();
        });
    });
});
