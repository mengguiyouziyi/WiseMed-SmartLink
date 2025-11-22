'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Save, Database, Shield, Bell, Palette } from 'lucide-react';
import styles from '../users/page.module.css';

export default function SystemConfigPage() {
    const [config, setConfig] = useState({
        siteName: 'WiseMed SmartLink',
        maxUploadSize: '100',
        sessionTimeout: '30',
        enableRegistration: true,
        enableEmailNotification: true,
        theme: 'auto',
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>
                        <Settings size={32} />
                        系统配置
                    </h1>
                    <p className={styles.subtitle}>
                        配置系统参数和选项
                    </p>
                </div>
                <Button leftIcon={<Save size={20} />}>
                    保存配置
                </Button>
            </div>

            {/* 基本设置 */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings size={20} />
                            基本设置
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>站点名称</label>
                            <input
                                type="text"
                                value={config.siteName}
                                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>最大上传文件大小 (MB)</label>
                            <input
                                type="number"
                                value={config.maxUploadSize}
                                onChange={(e) => setConfig({ ...config, maxUploadSize: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>会话超时时间 (分钟)</label>
                            <input
                                type="number"
                                value={config.sessionTimeout}
                                onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 安全设置 */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} />
                            安全设置
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={styles.form}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                            <div>
                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>允许用户注册</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    开启后新用户可以自行注册账号
                                </div>
                            </div>
                            <label style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '48px',
                                height: '24px'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={config.enableRegistration}
                                    onChange={(e) => setConfig({ ...config, enableRegistration: e.target.checked })}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: config.enableRegistration ? 'var(--primary)' : 'var(--border)',
                                    transition: '0.3s',
                                    borderRadius: '24px'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        content: '',
                                        height: '18px',
                                        width: '18px',
                                        left: config.enableRegistration ? '26px' : '3px',
                                        bottom: '3px',
                                        background: 'white',
                                        transition: '0.3s',
                                        borderRadius: '50%'
                                    }} />
                                </span>
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 通知设置 */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bell size={20} />
                            通知设置
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>邮件通知</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                开启后系统将发送邮件通知
                            </div>
                        </div>
                        <label style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '48px',
                            height: '24px'
                        }}>
                            <input
                                type="checkbox"
                                checked={config.enableEmailNotification}
                                onChange={(e) => setConfig({ ...config, enableEmailNotification: e.target.checked })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: config.enableEmailNotification ? 'var(--primary)' : 'var(--border)',
                                transition: '0.3s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: config.enableEmailNotification ? '26px' : '3px',
                                    bottom: '3px',
                                    background: 'white',
                                    transition: '0.3s',
                                    borderRadius: '50%'
                                }} />
                            </span>
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
