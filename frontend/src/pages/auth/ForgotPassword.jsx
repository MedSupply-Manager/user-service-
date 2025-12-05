import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const ForgotPassword = () => {
    const { forgotPassword, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            setError('Veuillez entrer votre email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email invalide');
            return;
        }

        const result = await forgotPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message || 'Erreur lors de l\'envoi de l\'email');
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
                        Email envoyé !
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
                        Vérifiez votre boîte de réception et suivez les instructions.
                    </p>
                    <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la connexion
                    </Link>
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
                    <h1 className="auth-title">Mot de passe oublié ?</h1>
                    <p className="auth-subtitle">
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
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
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                className="input pl-10"
                                placeholder="votre@email.com"
                                disabled={loading}
                            />
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
                                Envoi en cours...
                            </>
                        ) : (
                            'Envoyer le lien'
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;