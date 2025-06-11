import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Username from './pages/Username';
import Gender from './pages/Gender';
import Welcome from './pages/Welcome';
import Continue from './pages/Continue';
import Game from './pages/Game';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/Username" element={<Username />} />
    <Route path="/Gender" element={<Gender />} />
    <Route path="/Welcome" element={<Welcome />} />
    <Route path="/Continue" element={<Continue />} />
    <Route path="/Game" element={<Game />} />
  </Routes>
);

export default AppRoutes;
