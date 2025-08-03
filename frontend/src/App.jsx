// frontend/src/App.jsx (ฉบับสมบูรณ์ล่าสุด)

import { Routes, Route, Outlet } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

const AppLayout = () => (
  <div className="bg-background min-h-screen">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);

// --- Page Components ---
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import SingleTeamPage from './pages/SingleTeamPage';
import PlayersPage from './pages/PlayersPage';
import SinglePlayerPage from './pages/SinglePlayerPage'; // ตรวจสอบว่ามี import นี้
import MetaPage from './pages/MetaPage';
import SingleMetaPage from './pages/SingleMetaPage';
import NewsPage from './pages/NewsPage';
import SingleNewsPage from './pages/SingleNewsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageTeamsPage from './pages/admin/ManageTeamsPage';
import TeamFormPage from './pages/admin/TeamFormPage';
import ManageNewsPage from './pages/admin/ManageNewsPage';
import NewsFormPage from './pages/admin/NewsFormPage';
import ManageMetasPage from './pages/admin/ManageMetasPage';
import MetaFormPage from './pages/admin/MetaFormPage';
import ManagePlayersPage from './pages/admin/ManagePlayersPage';
import PlayerFormPage from './pages/admin/PlayerFormPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="teams/:id" element={<SingleTeamPage />} />
        
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:id" element={<SinglePlayerPage />} /> {/* <-- บรรทัดที่เพิ่มเข้ามา */}

        <Route path="meta" element={<MetaPage />} />
        <Route path="meta/:id" element={<SingleMetaPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:id" element={<SingleNewsPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* 2. Authentication Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 3. Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="manage-teams" element={<ManageTeamsPage />} />
            <Route path="manage-teams/new" element={<TeamFormPage />} />
            <Route path="manage-teams/edit/:id" element={<TeamFormPage />} />
            <Route path="manage-news" element={<ManageNewsPage />} />
            <Route path="manage-news/new" element={<NewsFormPage />} />
            <Route path="manage-news/edit/:id" element={<NewsFormPage />} />
            <Route path="manage-metas" element={<ManageMetasPage />} />
            <Route path="manage-metas/new" element={<MetaFormPage />} />
            <Route path="manage-metas/edit/:id" element={<MetaFormPage />} />
            <Route path="manage-players" element={<ManagePlayersPage />} />
            <Route path="manage-players/new" element={<PlayerFormPage />} />
            <Route path="manage-players/edit/:id" element={<PlayerFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;