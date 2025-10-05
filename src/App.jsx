import React from 'react';
import { HomePage } from './pages/HomePage';
import LandingPage from './pages/LandpingPage';

function App() {
  return (
    <div>
      {/* Uncomment dòng dưới để xem Landing Page với animation */}
      <LandingPage />

      {/* Hoặc giữ HomePage hiện tại */}
      {/* <HomePage /> */}
    </div>
  );
}

export default App;
