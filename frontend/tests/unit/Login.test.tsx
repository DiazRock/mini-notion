import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { DataMock } from '../../mocks/handlers';
import * as notificationHook from '../../src/utils/notificationHook';

describe('Login Component', () => {
    // Mock the axios module and type it as jest.Mocked<typeof axios>
    it('renders login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        
        expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/Username/i)[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument();
    });

    it('shows error message on failed login', async () => {

        // Mockings
        const mockUseNotification = jest.spyOn(notificationHook, 'useNotification');
        const mockShowNotification = jest.fn(); 
        mockUseNotification.mockReturnValue({
            showNotification: mockShowNotification,
            notification: null,
            callBackShowNotification: null,
        })
        // End of mockings

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        

        await waitFor(() => {
            expect(mockShowNotification).
                toHaveBeenCalledWith(
                    'error', 'Login failed. Please enter your credentials and try again'
                );
        })
    });

    it('redirects on successful login', async () => {

        // Mock a route to test navigation
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(
            screen.getByPlaceholderText(/username/i), 
            { target: { value: 'admin' } }
        );
        fireEvent.change(screen.getByPlaceholderText(/password/i), 
            { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe(`${DataMock.tokenPrefix}admin`);
            expect(window.location.href).toBe('http://localhost/');
        });
    });
});
