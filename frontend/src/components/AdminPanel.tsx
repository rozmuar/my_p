import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import { t } from '@/i18n/russian';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superAdmin';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin' | 'superAdmin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Mock data - replace with real API calls
  useEffect(() => {
    setUsers([
      {
        id: '1',
        name: 'Иван Петров',
        email: 'ivan@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-03-01',
      },
      {
        id: '2',
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-03-02',
      },
      {
        id: '3',
        name: 'Super Admin',
        email: 'admin@postapi.com',
        role: 'superAdmin',
        status: 'active',
        createdAt: '2024-01-01',
        lastLogin: '2024-03-03',
      },
    ]);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'superAdmin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'superAdmin':
        return t.superAdmin;
      case 'admin':
        return t.admin;
      default:
        return t.user;
    }
  };

  const getStatusIcon = (status: User['status']) => {
    return status === 'active' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    setShowMenu(null);
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    setShowMenu(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
    setShowMenu(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t.adminPanel}</h1>
        </div>
        <p className="text-gray-600">{t.userManagement}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.search + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Все роли</option>
            <option value="user">{t.user}</option>
            <option value="admin">{t.admin}</option>
            <option value="superAdmin">{t.superAdmin}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
          </select>

          {/* User Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} из {users.length} {t.users.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.user}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.role}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последний вход
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm text-gray-900">
                        {getRoleText(user.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className={`text-sm ${
                        user.status === 'active' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {user.status === 'active' ? t.active : t.inactive}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin || 'Никогда'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {showMenu === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                            Роль
                          </div>
                          <button
                            onClick={() => handleRoleChange(user.id, 'user')}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-2 ${
                              user.role === 'user' ? 'bg-primary-50 text-primary-700' : ''
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            <span>{t.user}</span>
                          </button>
                          <button
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-2 ${
                              user.role === 'admin' ? 'bg-primary-50 text-primary-700' : ''
                            }`}
                          >
                            <Shield className="w-4 h-4" />
                            <span>{t.admin}</span>
                          </button>
                          <button
                            onClick={() => handleRoleChange(user.id, 'superAdmin')}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-2 ${
                              user.role === 'superAdmin' ? 'bg-primary-50 text-primary-700' : ''
                            }`}
                          >
                            <Crown className="w-4 h-4" />
                            <span>{t.superAdmin}</span>
                          </button>
                          
                          <hr className="my-2" />
                          
                          <button
                            onClick={() => handleStatusToggle(user.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-2"
                          >
                            {user.status === 'active' ? (
                              <>
                                <XCircle className="w-4 h-4" />
                                <span>Деактивировать</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Активировать</span>
                              </>
                            )}
                          </button>
                          
                          {user.role !== 'superAdmin' && (
                            <>
                              <hr className="my-2" />
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full text-left px-3 py-2 hover:bg-red-50 transition-colors text-red-600 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>{t.delete}</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Пользователи не найдены</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;