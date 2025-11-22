'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/business/ImageUploader';
import { DicomViewer } from '@/components/business/DicomViewer';
import { InferenceService, InferenceResult } from '@/services/InferenceService';
import { Brain, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ImagingPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<InferenceResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setResult(null);
        setError(null);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setImageUrl(url);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const inferenceResult = await InferenceService.analyzeLungNodule(selectedFile);
            setResult(inferenceResult);
        } catch (err: any) {
            setError(err.message || '分析失败');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>智能影像中心</h1>
            <p className={styles.subtitle}>
                上传医学影像进行 AI 肺结节检测
            </p>

            <div className={styles.grid}>
                {/* Upload Panel */}
                <div className={styles.uploadPanel}>
                    <Card>
                        <CardHeader>
                            <CardTitle>上传影像</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader onFileSelect={handleFileSelect} />

                            {selectedFile && (
                                <div className={styles.actions}>
                                    <Button
                                        onClick={handleAnalyze}
                                        isLoading={isAnalyzing}
                                        leftIcon={<Brain size={16} />}
                                        className={styles.analyzeButton}
                                    >
                                        AI 智能分析
                                    </Button>
                                </div>
                            )}

                            {error && (
                                <div className={styles.error}>
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {result && (
                                <div className={styles.result}>
                                    <h4 className={styles.resultTitle}>分析结果</h4>
                                    <div className={styles.resultGrid}>
                                        <div className={styles.resultItem}>
                                            <span className={styles.resultLabel}>预测结果:</span>
                                            <span className={`${styles.resultValue} ${styles[result.prediction]}`}>
                                                {result.prediction.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className={styles.resultItem}>
                                            <span className={styles.resultLabel}>置信度:</span>
                                            <span className={styles.resultValue}>
                                                {(result.confidence * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className={styles.resultItem}>
                                            <span className={styles.resultLabel}>模型版本:</span>
                                            <span className={styles.resultValue}>{result.model_version}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Viewer Panel */}
                <div className={styles.viewerPanel}>
                    <DicomViewer
                        imageUrl={imageUrl}
                        annotations={result?.bounding_boxes?.map((box) => ({
                            ...box,
                            label: 'Nodule',
                        })) || []}
                    />
                </div>
            </div>
        </div>
    );
}
