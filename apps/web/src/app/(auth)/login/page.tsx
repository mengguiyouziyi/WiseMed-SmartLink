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
                throw new Error('用户名或密码错误');
            }
        } catch (err: any) {
            setError(err.message || '登录失败');
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
                    <CardTitle className={styles.title}>慧医智联企业版</CardTitle>
                    <p className={styles.subtitle}>安全访问门户</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="用户名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            required
                        />
                        <Input
                            label="密码"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                        />

                        {error && <div className={styles.error}>{error}</div>}

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            isLoading={isLoading}
                            leftIcon={<Lock size={16} />}
                        >
                            登录
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
