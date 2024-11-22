import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import ViewAll from './pages/ViewAll';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}>
                  <Route index element={<ViewAll />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/view-all" element={<ViewAll />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
