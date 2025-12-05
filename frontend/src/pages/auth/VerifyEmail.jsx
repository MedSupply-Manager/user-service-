import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyEmail } = useAuth();

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Token de vérification manquant');
            return;
        }

        handleVerifyEmail(token);
    }, [searchParams]);

    const handleVerifyEmail = async (token) => {
        try {
            const result = await verifyEmail(token);

            if (result.success) {
                setStatus('success');
                setMessage('Votre email a été vérifié avec succès !');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(result.message || 'Erreur lors de la vérification');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Une erreur est survenue');
        }
    };

    return (
        <div className="auth-container">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="auth-card animate-slide-up text-center">
                {/* Logo */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
                    <span className="text-2xl font-bold text-white">PS</span>
                </div>

                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Vérification en cours...</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Veuillez patienter pendant que nous vérifions votre email.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                            Email vérifié !
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Redirection vers la page de connexion...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                            <XCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                            Vérification échouée
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/login" className="btn-secondary">
                                Retour à la connexion
                            </Link>
                            <Link to="/register" className="btn-primary">
                                S'inscrire à nouveau
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;