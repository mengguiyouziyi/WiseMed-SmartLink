'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Move, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './DicomViewer.module.css';

// Note: Cornerstone.js integration would go here in a real implementation
// For now, we'll create a simplified viewer that works with standard images

interface DicomViewerProps {
    imageUrl: string | null;
    annotations?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        label: string;
        confidence: number;
    }>;
}

export function DicomViewer({ imageUrl, annotations = [] }: DicomViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!imageUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            imageRef.current = img;

            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            renderImage();
        };
        img.src = imageUrl;
    }, [imageUrl]);

    useEffect(() => {
        renderImage();
    }, [zoom, pan, annotations]);

    const renderImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imageRef.current;

        if (!canvas || !ctx || !img) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Draw annotations
        annotations.forEach((annotation) => {
            ctx.strokeStyle = annotation.confidence > 0.7 ? '#ef4444' : '#f59e0b';
            ctx.lineWidth = 2 / zoom;
            ctx.strokeRect(
                annotation.x,
                annotation.y,
                annotation.width,
                annotation.height
            );

            // Draw label
            ctx.fillStyle = annotation.confidence > 0.7 ? '#ef4444' : '#f59e0b';
            ctx.font = `${14 / zoom}px Arial`;
            ctx.fillText(
                `${annotation.label} (${(annotation.confidence * 100).toFixed(0)}%)`,
                annotation.x,
                annotation.y - 5 / zoom
            );
        });

        // Restore context state
        ctx.restore();
    };

    const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 5));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));
    const handleReset = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    leftIcon={<ZoomIn size={16} />}
                >
                    Zoom In
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    leftIcon={<ZoomOut size={16} />}
                >
                    Zoom Out
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    leftIcon={<Maximize2 size={16} />}
                >
                    Reset
                </Button>
                <div className={styles.zoomLevel}>
                    Zoom: {(zoom * 100).toFixed(0)}%
                </div>
            </div>

            <div className={styles.viewerContainer}>
                {imageUrl ? (
                    <canvas
                        ref={canvasRef}
                        className={styles.canvas}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <Move size={48} className={styles.placeholderIcon} />
                        <p>No image loaded</p>
                    </div>
                )}
            </div>
        </div>
    );
}
