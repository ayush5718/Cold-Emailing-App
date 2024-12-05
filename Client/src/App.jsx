import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
