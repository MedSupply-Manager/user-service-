import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, text = 'Chargement...' }) => {
    if (fullScreen) {
        return (
            <div className="flex items-center justify-center h-screen bg-dark-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
                    <p className="text-dark-400">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
                <p className="text-dark-400 text-sm">{text}</p>
            </div>
        </div>
    );
};

export default Loading;