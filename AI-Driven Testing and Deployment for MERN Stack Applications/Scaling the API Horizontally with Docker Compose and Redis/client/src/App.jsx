import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router';
import TaskList from './components/TaskList.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    function handleLogout() {
      navigate('/login', {
        replace: true,
        state: { message: 'Your session has expired. Please log in again.' },
      });
    }

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <div className="content-container">
                  <TaskList
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                  />
                </div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
