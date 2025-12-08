import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'pharmacie_standard', // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Available roles (excluding admin - only admin can create admin accounts)
    const availableRoles = [
        { value: 'admin_fournisseur', label: 'Admin Fournisseur', description: 'Gestion des fournisseurs et produits sensibles' },
        { value: 'pharmacie_autorisee', label: 'Pharmacie Autorisée', description: 'Accès aux produits sensibles' },
        { value: 'pharmacie_standard', label: 'Pharmacie Standard', description: 'Accès aux produits standard' },
        { value: 'hopital', label: 'Hôpital', description: 'Gestion hospitalière et commandes' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email invalide');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) return;

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.message || 'Erreur lors de l\'inscription');
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card animate-slide-up text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                        Inscription réussie !
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Un email de vérification a été envoyé à <strong>{formData.email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Votre compte a été créé avec le rôle: <strong className="text-primary-600">{availableRoles.find(r => r.value === formData.role)?.label}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Redirection vers la page de connexion...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="auth-card animate-slide-up max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
                        <span className="text-2xl font-bold text-white">PS</span>
                    </div>
                    <h1 className="auth-title">Créer un compte</h1>
                    <p className="auth-subtitle">Rejoignez PharmaStock aujourd'hui</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 animate-slide-down">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input pl-10"
                                    placeholder="johndoe"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input pl-10"
                                    placeholder="votre@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Shield className="inline w-4 h-4 mr-1" />
                            Type de compte
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableRoles.map((role) => (
                                <label
                                    key={role.value}
                                    className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.role === role.value
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-light-300 dark:border-dark-700 hover:border-primary-400'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.value}
                                        checked={formData.role === role.value}
                                        onChange={handleChange}
                                        className="sr-only"
                                        disabled={loading}
                                    />
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.role === role.value
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-gray-400'
                                            }`}>
                                            {formData.role === role.value && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="font-semibold text-sm text-light-900 dark:text-dark-50">
                                            {role.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-light-600 dark:text-dark-400 ml-6">
                                        {role.description}
                                    </p>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            * Les comptes administrateurs sont créés uniquement par l'équipe PharmaStock
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input pl-10 pr-10"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input pl-10 pr-10"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Inscription en cours...
                            </>
                        ) : (
                            'S\'inscrire'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Vous avez déjà un compte ?{' '}
                    </span>
                    <Link
                        to="/login"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;