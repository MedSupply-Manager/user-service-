import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Menu,
    X,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Gestion Utilisateurs' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-light-100 dark:bg-dark-950">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 w-64`}
            >
                <div className="h-full glass border-r border-light-300 dark:border-dark-700 flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-light-300 dark:border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">PS</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-light-900 dark:text-dark-50">PharmaStock</h2>
                                <p className="text-xs text-light-600 dark:text-dark-400">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                : 'text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-light-300 dark:border-dark-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-light-900 dark:text-dark-50 truncate">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-light-600 dark:text-dark-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Top Bar */}
                <header className="glass border-b border-light-300 dark:border-dark-700 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-light-200 dark:hover:bg-dark-800 rounded-lg transition-all"
                        >
                            {sidebarOpen ? (
                                <X className="w-5 h-5 text-light-900 dark:text-dark-50" />
                            ) : (
                                <Menu className="w-5 h-5 text-light-900 dark:text-dark-50" />
                            )}
                        </button>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;