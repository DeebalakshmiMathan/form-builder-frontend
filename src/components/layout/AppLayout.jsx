import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '../ui';
import { logout } from '../../features/auth/authSlice';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="text-lg font-bold text-brand-600">FormBuilder</Link>
          <Button variant="secondary" size="sm" onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</Button>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
    </div>
  );
}
