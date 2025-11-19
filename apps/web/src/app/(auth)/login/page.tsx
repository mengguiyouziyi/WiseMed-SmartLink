'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity, Lock } from 'lucide-react';
import styles from './page.module.css';
import { api } from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // In a real app, we would call the API
            // const res = await api.post<{ access_token: string }>('/auth/token', { username, password });
            // login(username, res.access_token);

            // Mock login for PoC
            if (username === 'admin' && password === 'admin') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
                login(username, 'mock-token');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
            </div>

            <Card className={styles.loginCard}>
                <CardHeader className={styles.header}>
                    <div className={styles.logo}>
                        <Activity size={48} className={styles.logoIcon} />
                    </div>
                    <CardTitle className={styles.title}>WiseMed Enterprise</CardTitle>
                    <p className={styles.subtitle}>Secure Access Portal</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />

                        {error && <div className={styles.error}>{error}</div>}

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            isLoading={isLoading}
                            leftIcon={<Lock size={16} />}
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
