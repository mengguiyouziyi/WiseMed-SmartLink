'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Key,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Eye,
    EyeOff,
    Save
} from 'lucide-react';
import styles from './page.module.css';

interface APIConfig {
    id: string;
    name: string;
    service_type: string;
    provider: string;
    endpoint: string;
    api_key?: string;
    model?: string;
    is_active: boolean;
    created_at: string;
}

const SERVICE_TYPES = [
    { value: 'asr', label: '语音识别 (ASR)' },
    { value: 'translation', label: '机器翻译 (NMT)' },
    { value: 'tts', label: '语音合成 (TTS)' },
    { value: 'medical_imaging', label: '医疗影像分析' },
    { value: 'image_recognition', label: '图像识别' },
    { value: 'llm', label: '大语言模型 (LLM)' },
];

const PROVIDERS = {
    asr: ['本地服务', 'OpenAI Whisper', 'Azure Speech', 'Google Speech'],
    translation: ['本地服务', 'Google Translate', 'DeepL', 'Baidu Translate'],
    tts: ['本地服务', 'Azure TTS', 'Google TTS'],
    medical_imaging: ['本地服务', '第三方医疗 AI'],
    image_recognition: ['Google Vision', 'Azure Vision', '本地模型'],
    llm: ['OpenAI GPT', 'Azure OpenAI', 'Ollama'],
};

export default function APIManagementPage() {
    const [configs, setConfigs] = useState<APIConfig[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingConfig, setEditingConfig] = useState<Partial<APIConfig>>({});
    const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        // TODO: 从后端加载配置
        // const response = await fetch('/api/admin/api-configs');
        // const data = await response.json();
        // setConfigs(data);

        // 模拟数据
        setConfigs([
            {
                id: '1',
                name: '本地 ASR 服务',
                service_type: 'asr',
                provider: '本地服务',
                endpoint: 'http://asr-tts-nmt-service:8000/transcribe',
                model: 'whisper-large-v3',
                is_active: true,
                created_at: '2025-11-21',
            },
            {
                id: '2',
                name: 'OpenAI Whisper API',
                service_type: 'asr',
                provider: 'OpenAI Whisper',
                endpoint: 'https://api.openai.com/v1/audio/transcriptions',
                api_key: 'sk-***',
                model: 'whisper-1',
                is_active: false,
                created_at: '2025-11-21',
            },
        ]);
    };

    const handleAdd = () => {
        setEditingConfig({
            service_type: 'asr',
            provider: '本地服务',
            is_active: true,
        });
        setIsEditing(true);
    };

    const handleEdit = (config: APIConfig) => {
        setEditingConfig(config);
        setIsEditing(true);
    };

    const handleSave = async () => {
        // TODO: 保存到后端
        // await fetch('/api/admin/api-configs', {
        //   method: editingConfig.id ? 'PUT' : 'POST',
        //   body: JSON.stringify(editingConfig),
        // });

        setIsEditing(false);
        setEditingConfig({});
        loadConfigs();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个 API 配置吗？')) return;

        // TODO: 删除
        // await fetch(`/api/admin/api-configs/${id}`, { method: 'DELETE' });

        loadConfigs();
    };

    const toggleApiKeyVisibility = (id: string) => {
        setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>
                        <Key size={32} />
                        API 管理
                    </h1>
                    <p className={styles.subtitle}>
                        配置和管理各类 AI 服务 API（本地部署或线上服务）
                    </p>
                </div>
                <Button onClick={handleAdd} leftIcon={<Plus size={20} />}>
                    添加 API 配置
                </Button>
            </div>

            {isEditing && (
                <Card className={styles.editCard}>
                    <CardHeader>
                        <CardTitle>
                            {editingConfig.id ? '编辑 API 配置' : '添加 API 配置'}
                        </CardTitle>&gt;
                    </CardHeader>
                    <CardContent>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>配置名称</label>
                                <input
                                    type="text"
                                    value={editingConfig.name || ''}
                                    onChange={(e) =>
                                        setEditingConfig({ ...editingConfig, name: e.target.value })
                                    }
                                    placeholder="例如：本地 ASR 服务"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>服务类型</label>
                                    <select
                                        value={editingConfig.service_type || 'asr'}
                                        onChange={(e) =>
                                            setEditingConfig({
                                                ...editingConfig,
                                                service_type: e.target.value,
                                                provider: PROVIDERS[e.target.value as keyof typeof PROVIDERS][0],
                                            })
                                        }
                                    >
                                        {SERVICE_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>提供商</label>
                                    <select
                                        value={editingConfig.provider || ''}
                                        onChange={(e) =>
                                            setEditingConfig({ ...editingConfig, provider: e.target.value })
                                        }
                                    >
                                        {PROVIDERS[editingConfig.service_type as keyof typeof PROVIDERS]?.map(
                                            (provider) => (
                                                <option key={provider} value={provider}>
                                                    {provider}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>API 端点</label>
                                <input
                                    type="text"
                                    value={editingConfig.endpoint || ''}
                                    onChange={(e) =>
                                        setEditingConfig({ ...editingConfig, endpoint: e.target.value })
                                    }
                                    placeholder="https://api.example.com/v1/endpoint"
                                />
                            </div>

                            {editingConfig.provider !== '本地服务' && (
                                <div className={styles.formGroup}>
                                    <label>API 密钥</label>
                                    <input
                                        type="password"
                                        value={editingConfig.api_key || ''}
                                        onChange={(e) =>
                                            setEditingConfig({ ...editingConfig, api_key: e.target.value })
                                        }
                                        placeholder="sk-***"
                                    />
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>模型名称（可选）</label>
                                <input
                                    type="text"
                                    value={editingConfig.model || ''}
                                    onChange={(e) =>
                                        setEditingConfig({ ...editingConfig, model: e.target.value })
                                    }
                                    placeholder="whisper-large-v3"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={editingConfig.is_active || false}
                                        onChange={(e) =>
                                            setEditingConfig({ ...editingConfig, is_active: e.target.checked })
                                        }
                                    />
                                    <span>启用此配置</span>
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <Button onClick={handleSave} leftIcon={<Save size={16} />}>
                                    保存
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingConfig({});
                                    }}
                                    leftIcon={<X size={16} />}
                                >
                                    取消
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className={styles.configList}>
                {configs.map((config) => (
                    <Card key={config.id} className={styles.configCard}>
                        <CardContent>
                            <div className={styles.configHeader}>
                                <div>
                                    <h3 className={styles.configName}>{config.name}</h3>
                                    <div className={styles.configMeta}>
                                        <span className={styles.badge}>{config.service_type.toUpperCase()}</span>
                                        <span className={styles.provider}>{config.provider}</span>
                                        {config.is_active ? (
                                            <span className={styles.statusActive}>
                                                <Check size={14} /> 启用
                                            </span>
                                        ) : (
                                            <span className={styles.statusInactive}>
                                                <X size={14} /> 禁用
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.configActions}>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(config)}
                                        leftIcon={<Edit size={16} />}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(config.id)}
                                        leftIcon={<Trash2 size={16} />}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.configDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>端点:</span>
                                    <code className={styles.detailValue}>{config.endpoint}</code>
                                </div>
                                {config.api_key && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>API 密钥:</span>
                                        <div className={styles.apiKeyRow}>
                                            <code className={styles.detailValue}>
                                                {showApiKey[config.id] ? config.api_key : '••••••••••••'}
                                            </code>
                                            <button
                                                className={styles.toggleButton}
                                                onClick={() => toggleApiKeyVisibility(config.id)}
                                            >
                                                {showApiKey[config.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {config.model && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>模型:</span>
                                        <code className={styles.detailValue}>{config.model}</code>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
