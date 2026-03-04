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
  Crown,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';
import { t } from '@/i18n/russian';
import { apiService } from '@/services/api';
import { useAppStore } from '@/store';
import toast from 'react-hot-toast';
import type { User } from '@/types';

const AdminPanel = () => {
  const { currentUser } = useAppStore();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'editor' | 'viewer' | 'admin' | 'superAdmin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'news'>('users');

  // Load real users data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await apiService.getUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Ошибка загрузки пользователей');
      // Fallback to empty array
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
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

  const getStatusIcon = (isActive?: boolean) => {
    return isActive 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await apiService.updateUser(userId, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('Роль пользователя обновлена');
    } catch (error) {
      toast.error('Ошибка обновления роли');
    }
    setShowMenu(null);
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.isActive ? false : true;
      await apiService.updateUser(userId, { isActive: newStatus });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));
      toast.success('Статус пользователя обновлен');
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
    setShowMenu(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    
    try {
      await apiService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Пользователь удален');
    } catch (error) {
      toast.error('Ошибка удаления пользователя');
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
        <p className="text-gray-600">Управление пользователями и контентом</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Пользователи</span>
            </div>
          </button>
          
          {(currentUser?.role === 'superAdmin') && (
            <button
              onClick={() => setActiveTab('news')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Управление новостями</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Загрузка пользователей...</div>
            </div>
          )}

          {/* User Management Content */}
          {!isLoading && (
            <div>

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
                      {getStatusIcon(user.isActive)}
                      <span className={`text-sm ${
                        user.isActive ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {user.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt || 'Никогда'}
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
                            {user.isActive ? (
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

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Пользователи не найдены</p>
        </div>
      )}
            </div>
          )}
        </div>
      )}

      {/* News Management Tab */}
      {activeTab === 'news' && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Управление новостями</p>
              <p className="text-gray-400 text-sm">Функциональность в разработке</p>
              <button
                onClick={() => window.open('/admin/news', '_blank')}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Открыть редактор новостей
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;