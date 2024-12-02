import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import ViewAll from './pages/ViewAll';
import Login from './pages/Login';
import Register from './pages/Register';
import { Task } from './interfaces';
import './App.css'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks visible={true} onClose= {() => {}} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <Notes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/view-all"
                    element={
                        <ProtectedRoute>
                            <ViewAll />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
