import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Transaction {
    _id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: 'bank_transfer' | 'crypto' | 'card';
    createdAt: string;
    reference: string;
}

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const transactionApi = {
    createDeposit: async (data: {
        amount: number;
        currency: string;
        paymentMethod: string;
    }) => {
        const response = await api.post<Transaction>('/transactions/deposit', data);
        return response.data;
    },

    createWithdrawal: async (data: {
        amount: number;
        currency: string;
        paymentMethod: string;
    }) => {
        const response = await api.post<Transaction>('/transactions/withdraw', data);
        return response.data;
    },

    getMyTransactions: async () => {
        const response = await api.get<Transaction[]>('/transactions/my-transactions');
        return response.data;
    },

    getAllTransactions: async () => {
        const response = await api.get<Transaction[]>('/transactions/all');
        return response.data;
    },

    updateTransactionStatus: async (transactionId: string, status: string) => {
        const response = await api.patch<Transaction>(`/transactions/${transactionId}/status`, { status });
        return response.data;
    }
};

export default api; 