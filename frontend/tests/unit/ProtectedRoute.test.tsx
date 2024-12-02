import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(({ to }) => <div>Redirected to {to}</div>)
}));

describe('ProtectedRoute Component', () => {
    it('redirects to login if token is missing', () => {
        localStorage.removeItem('token'); // Ensure no token exists

        const { getByText } = render(
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<ProtectedRoute><div>Home Page</div></ProtectedRoute>}
                    />
                </Routes>
            </BrowserRouter>
        );

        expect(getByText(/redirected to \/login/i)).toBeInTheDocument();
    });

    it('renders children if token is present', () => {
        localStorage.setItem('token', 'mockToken'); // Mock token in localStorage

        const { getByText } = render(
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<ProtectedRoute><div>Home Page</div></ProtectedRoute>}
                    />
                </Routes>
            </BrowserRouter>
        );

        expect(getByText(/home page/i)).toBeInTheDocument();
    });
});
