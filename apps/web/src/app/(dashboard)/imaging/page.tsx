'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ImageUploader } from '@/components/business/ImageUploader';
import { Brain, Activity, FileText, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const DicomViewer = dynamic(() => import('@/components/imaging/DicomViewer'), {
    ssr: false,
    loading: () => <div className="h-[600px] bg-black flex items-center justify-center text-white">Loading Viewer...</div>
});

export default function ImagingPage() {
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/imaging/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            // Use the WADO-URI returned by backend
            // Note: We need to prepend 'wadouri:' for Cornerstone to identify the loader
            const imageId = `wadouri:${window.location.origin}${data.url}`;
            setImageIds([imageId]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('上传失败，请重试');
        }
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Mock analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            alert('AI 分析完成！未发现明显异常。');
        }, 3000);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        <Brain size={32} className="text-primary" />
                        智能影像分析
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        上传 DICOM 影像进行 AI 辅助诊断
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Upload and Viewer */}
                <div className="lg:col-span-2 space-y-6">
                    {imageIds.length === 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <ImageUploader onFileSelect={handleUpload} />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden border-primary/50 shadow-lg shadow-primary/10">
                            <CardContent className="p-0">
                                <DicomViewer imageIds={imageIds} className="h-[600px]" />
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-200 dark:border-gray-800">
                                    <div className="text-sm text-gray-500">
                                        已加载 {imageIds.length} 张影像
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setImageIds([])}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            重新上传
                                        </button>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className={`px-6 py-2 rounded-lg bg-primary text-white font-medium transition-all
                        ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark shadow-lg shadow-primary/20'}
                      `}
                                        >
                                            {isAnalyzing ? '正在分析...' : '开始 AI 分析'}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Analysis Results */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-primary" />
                                分析结果
                            </h3>
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                                    <p>AI 正在分析影像特征...</p>
                                </div>
                            ) : imageIds.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                                            <Activity size={16} />
                                            初步诊断
                                        </div>
                                        <p className="text-sm text-green-800 dark:text-green-300">
                                            影像质量良好，未发现明显病变区域。建议结合临床症状进一步检查。
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">检测到的特征</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>肺纹理</span>
                                                <span className="text-gray-500">正常</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>纵隔</span>
                                                <span className="text-gray-500">居中</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>心脏大小</span>
                                                <span className="text-gray-500">正常范围</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>请先上传影像</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <AlertCircle size={20} className="text-orange-500" />
                                注意事项
                            </h3>
                            <ul className="text-sm text-gray-500 space-y-2 list-disc pl-4">
                                <li>支持 DICOM (.dcm) 格式文件</li>
                                <li>支持多文件批量上传</li>
                                <li>AI 分析结果仅供参考，请以医生诊断为准</li>
                                <li>请确保影像中不包含患者敏感隐私信息</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
