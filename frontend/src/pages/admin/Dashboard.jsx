import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import userService from '../../services/userService';
import Loading from '../../components/Loading';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, usersRes] = await Promise.all([
                userService.getAdminDashboard(),
                userService.getAllUsers(),
            ]);

            if (usersRes.success) {
                setUsers(usersRes.users);

                // Calculate stats from users
                const totalUsers = usersRes.users.length;
                const activeUsers = usersRes.users.filter(u => u.status === 'active').length;
                const inactiveUsers = usersRes.users.filter(u => u.status === 'inactive').length;
                const pendingUsers = usersRes.users.filter(u => u.status === 'pending').length;

                setStats({
                    totalUsers,
                    activeUsers,
                    inactiveUsers,
                    pendingUsers,
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Loading fullScreen={false} />
            </AdminLayout>
        );
    }

    const statCards = [
        {
            title: 'Total Utilisateurs',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'primary',
            bgColor: 'bg-primary-500',
        },
        {
            title: 'Utilisateurs Actifs',
            value: stats?.activeUsers || 0,
            icon: UserCheck,
            color: 'green',
            bgColor: 'bg-green-500',
        },
        {
            title: 'En Attente',
            value: stats?.pendingUsers || 0,
            icon: Activity,
            color: 'yellow',
            bgColor: 'bg-yellow-500',
        },
        {
            title: 'Inactifs',
            value: stats?.inactiveUsers || 0,
            icon: UserX,
            color: 'red',
            bgColor: 'bg-red-500',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-light-900 dark:text-dark-50 mb-2">
                        Tableau de Bord Admin
                    </h1>
                    <p className="text-light-600 dark:text-dark-400">
                        Vue d'ensemble de la gestion des utilisateurs
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="card hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-light-600 dark:text-dark-400 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-light-900 dark:text-dark-50">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Users */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-light-900 dark:text-dark-50">
                            Utilisateurs Récents
                        </h2>
                        <a
                            href="/admin/users"
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                        >
                            Voir tous →
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-300 dark:border-dark-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Utilisateur
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Rôle
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.slice(0, 5).map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-light-200 dark:border-dark-800 hover:bg-light-50 dark:hover:bg-dark-800/50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-light-900 dark:text-dark-50">
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-light-700 dark:text-dark-300">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="badge badge-primary">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`badge ${user.status === 'active'
                                                        ? 'badge-success'
                                                        : user.status === 'pending'
                                                            ? 'badge-warning'
                                                            : 'badge-danger'
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;