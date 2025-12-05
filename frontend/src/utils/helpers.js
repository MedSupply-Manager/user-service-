// Format currency
export const formatCurrency = (amount, currency = '€') => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount).replace('€', currency);
};

// Format date
export const formatDate = (date, format = 'short') => {
    const d = new Date(date);

    if (format === 'short') {
        return d.toLocaleDateString('fr-FR');
    }

    if (format === 'long') {
        return d.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    if (format === 'time') {
        return d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return d.toLocaleString('fr-FR');
};

// Truncate text
export const truncate = (text, length = 50) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Generate random color
export const getRandomColor = () => {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Get stock status
export const getStockStatus = (current, threshold = 10) => {
    if (current === 0) return { label: 'Rupture', color: 'danger' };
    if (current <= threshold) return { label: 'Faible', color: 'warning' };
    return { label: 'Disponible', color: 'success' };
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
};

// Debounce function
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

// Download as JSON
export const downloadJSON = (data, filename = 'data.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default {
    formatCurrency,
    formatDate,
    truncate,
    getInitials,
    isValidEmail,
    getRandomColor,
    getStockStatus,
    calculatePercentage,
    debounce,
    copyToClipboard,
    downloadJSON,
};