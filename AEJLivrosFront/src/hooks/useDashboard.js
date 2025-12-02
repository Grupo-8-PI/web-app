import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = (autoLoad = true, refreshInterval = 0) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getDashboardStats();
            setStats(data);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Erro ao carregar estatísticas da dashboard';
            setError(errorMessage);
            console.error('Erro no useDashboard:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(() => {
        return loadStats();
    }, [loadStats]);

    useEffect(() => {
        if (autoLoad) {
            loadStats();
        }
    }, [autoLoad, loadStats]);

    useEffect(() => {
        if (refreshInterval > 0) {
            const intervalId = setInterval(() => {
                loadStats();
            }, refreshInterval);

            return () => clearInterval(intervalId);
        }
    }, [refreshInterval, loadStats]);

    return {
        stats,
        loading,
        error,
        refresh,
        loadStats
    };
};

export default useDashboard;