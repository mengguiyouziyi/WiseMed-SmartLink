'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import initCornerstone from '@/lib/cornerstone-init';
import { Loader } from 'lucide-react';

interface DicomViewerProps {
    imageIds: string[];
    className?: string;
}

export default function DicomViewer({ imageIds, className }: DicomViewerProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize Cornerstone
        initCornerstone();

        const element = elementRef.current;
        if (!element) return;

        // Enable the element
        cornerstone.enable(element);

        // Load the first image
        if (imageIds.length > 0) {
            setIsLoading(true);
            setError(null);

            cornerstone.loadImage(imageIds[0])
                .then((image: any) => {
                    cornerstone.displayImage(element, image);

                    // Add stack state for scrolling if multiple images
                    if (imageIds.length > 1) {
                        const stack = {
                            currentImageIdIndex: 0,
                            imageIds: imageIds,
                        };
                        cornerstoneTools.addStackStateManager(element, ['stack']);
                        cornerstoneTools.addToolState(element, 'stack', stack);
                    }

                    setIsLoading(false);
                })
                .catch((err: any) => {
                    console.error('Error loading image:', err);
                    setError('无法加载影像，请检查文件格式');
                    setIsLoading(false);
                });
        }

        return () => {
            if (element) {
                cornerstone.disable(element);
            }
        };
    }, [imageIds]);

    return (
        <div className={`relative bg-black ${className}`} style={{ minHeight: '500px' }}>
            <div
                ref={elementRef}
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()} // Prevent context menu for right-click zoom
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10">
                    <div className="flex flex-col items-center gap-2">
                        <Loader className="animate-spin" size={32} />
                        <span>加载影像中...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-500 z-10">
                    <span>{error}</span>
                </div>
            )}

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 text-white text-sm pointer-events-none select-none">
                <div className="font-bold text-primary">WiseMed AI Viewer</div>
                <div>Zoom: {(elementRef.current && cornerstone.getViewport(elementRef.current)?.scale || 1).toFixed(2)}x</div>
                <div>WW/WC: {(elementRef.current && cornerstone.getViewport(elementRef.current)?.voi?.windowWidth || '-').toFixed(0)} / {(elementRef.current && cornerstone.getViewport(elementRef.current)?.voi?.windowCenter || '-').toFixed(0)}</div>
            </div>

            <div className="absolute bottom-4 left-4 text-white text-xs pointer-events-none select-none opacity-70">
                <div>左键: 调整窗宽窗位 (WW/WC)</div>
                <div>中键: 移动 (Pan)</div>
                <div>右键: 缩放 (Zoom)</div>
                <div>滚轮: 切换切片 (Scroll)</div>
            </div>
        </div>
    );
}
