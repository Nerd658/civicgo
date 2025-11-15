import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home'; // Although Home is not directly routed, it might be used elsewhere or for future public content.
import UserProfile from './components/UserProfile';
import Feed from './components/Feed';
import Chatbot from './components/Chatbot';
import CodeValidation from './components/CodeValidation';
import ProposeAction from './components/ProposeAction';
import ProtectedRoute from './components/ProtectedRoute';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    // Routes component from react-router-dom manages the application's navigation.
    <Routes>
      {/* Public Routes: Accessible to all users, regardless of authentication status. */}
      {/* The /login path is used for user authentication (login and registration). */}
      <Route path="/login" element={<Auth />} />
      {/* The /register path is also handled by the Auth component for user registration. */}
      <Route path="/register" element={<Auth />} />
      
      {/* Protected Routes: These routes require the user to be authenticated. */}
      {/* The <ProtectedRoute /> component acts as a wrapper, checking for user authentication. */}
      {/* If the user is not authenticated, they will be redirected to the /login page. */}
      <Route element={<ProtectedRoute />}>
        {/* The root path "/" now points to the Feed component, making it the default landing page for authenticated users. */}
        <Route path="/" element={<Feed />} /> 
        {/* User profile page. */}
        <Route path="/profile" element={<UserProfile />} />
        {/* The main feed displaying actions. */}
        <Route path="/feed" element={<Feed />} />
        {/* Chatbot page (optional feature). */}
        <Route path="/chatbot" element={<Chatbot />} />
        {/* Page for validating participation codes. */}
        <Route path="/validate-code" element={<CodeValidation />} />
        {/* Page for proposing new actions. */}
        <Route path="/propose-action" element={<ProposeAction />} />
        {/* Leaderboard page displaying user rankings. */}
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      {/* Catch-all Route: Redirects any unmatched routes to the main protected feed. */}
      {/* The 'replace' prop ensures that the navigation replaces the current entry in the history stack. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;