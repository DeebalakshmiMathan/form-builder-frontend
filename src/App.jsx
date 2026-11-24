import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import FormsListPage from './pages/FormsListPage';
import FormBuilderPage from './pages/FormBuilderPage';
import SubmissionsPage from './pages/SubmissionsPage';
import PublicFormPage from './pages/PublicFormPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forms/:formId" element={<PublicFormPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<FormsListPage />} />
          <Route path="/admin/forms/new" element={<FormBuilderPage />} />
          <Route path="/admin/forms/:id/edit" element={<FormBuilderPage />} />
          <Route path="/admin/forms/:id/submissions" element={<SubmissionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
