import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Alert,
    Box,
    Chip
} from '@mui/material';
import { transactionApi, Transaction } from '../services/api';

const AdminDashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await transactionApi.getAllTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to load transactions');
        }
    };

    const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
        try {
            await transactionApi.updateTransactionStatus(transactionId, newStatus);
            setSuccess('Transaction status updated successfully');
            loadTransactions();
        } catch (err) {
            setError('Failed to update transaction status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Transaction Management
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>{transaction.user}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>
                                        {transaction.currency} {transaction.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={transaction.status}
                                            color={getStatusColor(transaction.status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {transaction.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => handleStatusUpdate(transaction._id, 'completed')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => handleStatusUpdate(transaction._id, 'failed')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default AdminDashboard; 