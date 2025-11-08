import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Snippets from './pages/Snippets';
import TeamMode from './pages/TeamMode';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/snippets"
              element={
                <PrivateRoute>
                  <Snippets />
                </PrivateRoute>
              }
            />
            <Route
              path="/team"
              element={
                <PrivateRoute>
                  <TeamMode />
                </PrivateRoute>
              }
            />
            <Route
              path="/team/:roomId"
              element={
                <PrivateRoute>
                  <TeamMode />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
