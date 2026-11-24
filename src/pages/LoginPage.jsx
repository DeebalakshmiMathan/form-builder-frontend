import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, FieldWrapper, TextInput } from '../components/ui';
import { login } from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) navigate(location.state?.from?.pathname || '/admin', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card title="Admin login" className="w-full max-w-sm">
        <form onSubmit={submit} className="space-y-4">
          <FieldWrapper label="Email"><TextInput type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} autoFocus /></FieldWrapper>
          <FieldWrapper label="Password"><TextInput type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} /></FieldWrapper>
          <Alert type="error">{error}</Alert>
          <Button type="submit" className="w-full" loading={status === 'loading'}>Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
