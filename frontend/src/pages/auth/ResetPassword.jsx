import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuth();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.password || !formData.confirmPassword) {
            setError('Veuillez remplir tous les champs');
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

        if (!validateForm()) return;

        const result = await resetPassword(token, formData.password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.message || 'Erreur lors de la réinitialisation');
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
                        Mot de passe réinitialisé !
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Votre mot de passe a été modifié avec succès.
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

            <div className="auth-card animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
                        <span className="text-2xl font-bold text-white">PS</span>
                    </div>
                    <h1 className="auth-title">Nouveau mot de passe</h1>
                    <p className="auth-subtitle">Choisissez un nouveau mot de passe sécurisé</p>
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
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
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

                    {/* Password Requirements */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Le mot de passe doit contenir :</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li className={formData.password.length >= 6 ? 'text-green-500' : ''}>
                                Au moins 6 caractères
                            </li>
                        </ul>
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
                                Réinitialisation...
                            </>
                        ) : (
                            'Réinitialiser le mot de passe'
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Vous vous souvenez de votre mot de passe ?{' '}
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

export default ResetPassword;