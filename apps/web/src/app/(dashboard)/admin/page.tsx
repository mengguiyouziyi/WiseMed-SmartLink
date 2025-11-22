'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Server,
    Database,
    Activity,
    Shield,
    FileText,
    Stethoscope,
    Package,
    MessageSquare,
    Brain,
    Languages,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import styles from './page.module.css';

const SERVICES = [
    {
        name: 'AI 推理服务',
        icon: Brain,
        status: 'healthy',
        description: 'MONAI DenseNet121 肺结节检测',
        endpoint: 'http://localhost:8002'
    },
    {
        name: '医疗翻译服务',
        icon: Languages,
        status: 'healthy',
        description: 'HuggingFace NMT + Whisper ASR',
        endpoint: 'http://localhost:8004'
    },
    {
        name: '认证服务',
        icon: Shield,
        status: 'healthy',
        description: 'Keycloak OIDC/OAuth2',
        endpoint: 'http://localhost:8001'
    },
    {
        name: 'PACS 网关',
        icon: ImageIcon,
        status: 'healthy',
        description: 'Orthanc DICOM 存储与路由',
        endpoint: 'http://localhost:8003'
    },
    {
        name: '审计服务',
        icon: FileText,
        status: 'planned',
        description: '操作日志与合规审计',
        endpoint: 'N/A'
    },
    {
        name: 'EMR 适配器',
        icon: Stethoscope,
        status: 'planned',
        description: '对接第三方电子病历系统',
        endpoint: 'N/A'
    },
    {
        name: '库存服务',
        icon: Package,
        status: 'planned',
        description: '药品与耗材库存管理',
        endpoint: 'N/A'
    },
];

const INFRASTRUCTURE = [
    { name: 'PostgreSQL', icon: Database, status: 'healthy', port: '5433' },
    { name: 'Redpanda (Kafka)', icon: MessageSquare, status: 'healthy', port: '9092' },
    { name: 'MinIO', icon: Server, status: 'healthy', port: '9000' },
    { name: 'Prometheus', icon: Activity, status: 'healthy', port: '9090' },
    { name: 'Grafana', icon: Activity, status: 'healthy', port: '3000' },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'healthy':
            return <CheckCircle className={styles.statusHealthy} size={20} />;
        case 'degraded':
            return <AlertCircle className={styles.statusDegraded} size={20} />;
        case 'planned':
            return <AlertCircle className={styles.statusPlanned} size={20} />;
        default:
            return <XCircle className={styles.statusDown} size={20} />;
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'healthy':
            return '运行中';
        case 'degraded':
            return '降级';
        case 'planned':
            return '规划中';
        default:
            return '离线';
    }
};

export default function AdminPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>系统管理</h1>
            <p className={styles.subtitle}>
                服务监控、配置管理与系统诊断
            </p>

            {/* Business Services */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>业务服务</h2>
                <div className={styles.grid}>
                    {SERVICES.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Card key={service.name} className={styles.serviceCard}>
                                <CardHeader>
                                    <div className={styles.serviceHeader}>
                                        <Icon size={24} className={styles.serviceIcon} />
                                        <CardTitle>{service.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className={styles.serviceDescription}>
                                        {service.description}
                                    </p>
                                    <div className={styles.serviceFooter}>
                                        <div className={styles.statusBadge}>
                                            {getStatusIcon(service.status)}
                                            <span>{getStatusText(service.status)}</span>
                                        </div>
                                        <code className={styles.endpoint}>{service.endpoint}</code>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Infrastructure */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>基础设施</h2>
                <div className={styles.grid}>
                    {INFRASTRUCTURE.map((infra) => {
                        const Icon = infra.icon;
                        return (
                            <Card key={infra.name} className={styles.infraCard}>
                                <CardContent>
                                    <div className={styles.infraHeader}>
                                        <Icon size={20} />
                                        <span className={styles.infraName}>{infra.name}</span>
                                    </div>
                                    <div className={styles.infraFooter}>
                                        {getStatusIcon(infra.status)}
                                        <span className={styles.infraPort}>端口: {infra.port}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* System Info */}
            <section className={styles.section}>
                <Card>
                    <CardHeader>
                        <CardTitle>系统信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.systemInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>项目版本:</span>
                                <span className={styles.infoValue}>v1.0.0-production</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>部署模式:</span>
                                <span className={styles.infoValue}>云边协同 (Central Profile)</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>运行时间:</span>
                                <span className={styles.infoValue}>24 小时 15 分钟</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>监控面板:</span>
                                <a
                                    href="http://localhost:3000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.infoLink}
                                >
                                    Grafana Dashboard →
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
