import AdminPanel from '@/components/AdminPanel';
import Header from '@/components/Header';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminPanel />
    </div>
  );
};

export default AdminPage;