import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from './Main';
import Username from './Username';
import Gender from './Gender';
import Welcome from './Welcome';
import Continue from './Continue';
import ContinueStart from './ContinueStart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/Username" element={<Username />} />
      <Route path="/Gender" element={<Gender />} />
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/Continue" element={<Continue />} />
      <Route path="/ContinueStart" element={<ContinueStart />} />

    </Routes>
  );
}

export default App;
