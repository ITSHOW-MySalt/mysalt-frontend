import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from './Main';
import Username from './Username';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/Username" element={<Username />} />

    </Routes>
  );
}

export default App;
