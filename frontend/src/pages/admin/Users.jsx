import { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Eye, UserPlus, Filter, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import userService from '../../services/userService';
import Loading from '../../components/Loading';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, filterStatus, filterRole]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            if (response.success) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter((user) => user.status === filterStatus);
        }

        // Role filter
        if (filterRole !== 'all') {
            filtered = filtered.filter((user) => user.role === filterRole);
        }

        setFilteredUsers(filtered);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await userService.deleteUser(selectedUser._id);
            if (response.success) {
                fetchUsers();
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            username: formData.get('username'),
            email: formData.get('email'),
            role: formData.get('role'),
            status: formData.get('status'),
        };

        try {
            const response = await userService.updateUser(selectedUser._id, updates);
            if (response.success) {
                fetchUsers();
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Loading fullScreen={false} />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-light-900 dark:text-dark-50 mb-2">
                            Gestion des Utilisateurs
                        </h1>
                        <p className="text-light-600 dark:text-dark-400">
                            Gérer tous les utilisateurs du système
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="pending">En attente</option>
                            <option value="inactive">Inactif</option>
                        </select>

                        {/* Role Filter */}
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="input"
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="admin">Admin</option>
                            <option value="admin_fournisseur">Admin Fournisseur</option>
                            <option value="pharmacie_autorisee">Pharmacie Autorisée</option>
                            <option value="pharmacie_standard">Pharmacie Standard</option>
                            <option value="hopital">Hôpital</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-light-900 dark:text-dark-50">
                            Utilisateurs ({filteredUsers.length})
                        </h2>
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
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Email Vérifié
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-light-700 dark:text-dark-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-light-200 dark:border-dark-800 hover:bg-light-50 dark:hover:bg-dark-800/50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
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
                                            <span className="badge badge-primary">{user.role}</span>
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
                                        <td className="py-3 px-4">
                                            <span
                                                className={`badge ${user.emailVerified ? 'badge-success' : 'badge-warning'
                                                    }`}
                                            >
                                                {user.emailVerified ? 'Oui' : 'Non'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 hover:bg-primary-50 dark:hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-light-600 dark:text-dark-400">
                                    Aucun utilisateur trouvé
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card max-w-md w-full animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-light-900 dark:text-dark-50">
                                Modifier l'utilisateur
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-light-200 dark:hover:bg-dark-800 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    defaultValue={selectedUser.username}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser.email}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Rôle</label>
                                <select name="role" defaultValue={selectedUser.role} className="input">
                                    <option value="admin">Admin</option>
                                    <option value="admin_fournisseur">Admin Fournisseur</option>
                                    <option value="pharmacie_autorisee">Pharmacie Autorisée</option>
                                    <option value="pharmacie_standard">Pharmacie Standard</option>
                                    <option value="hopital">Hôpital</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Statut</label>
                                <select name="status" defaultValue={selectedUser.status} className="input">
                                    <option value="active">Actif</option>
                                    <option value="pending">En attente</option>
                                    <option value="inactive">Inactif</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary flex-1">
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card max-w-md w-full animate-slide-up">
                        <h3 className="text-xl font-bold text-light-900 dark:text-dark-50 mb-4">
                            Confirmer la suppression
                        </h3>
                        <p className="text-light-700 dark:text-dark-300 mb-6">
                            Êtes-vous sûr de vouloir désactiver l'utilisateur{' '}
                            <strong>{selectedUser.username}</strong> ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={confirmDelete} className="btn-danger flex-1">
                                Confirmer
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Users;