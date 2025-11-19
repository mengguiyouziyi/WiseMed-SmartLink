'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    acceptedFormats?: string[];
}

export function ImageUploader({
    onFileSelect,
    acceptedFormats = ['.dcm', '.jpg', '.jpeg', '.png']
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const processFile = (file: File) => {
        setSelectedFile(file);

        // Generate preview for image files (not DICOM)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div className={styles.container}>
            {!selectedFile ? (
                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload className={styles.uploadIcon} size={48} />
                    <p className={styles.title}>Drag & Drop Image</p>
                    <p className={styles.subtitle}>or click to browse</p>
                    <p className={styles.formats}>
                        Supported: {acceptedFormats.join(', ')}
                    </p>
                    <input
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileInput}
                        className={styles.fileInput}
                    />
                </div>
            ) : (
                <div className={styles.preview}>
                    <div className={styles.previewHeader}>
                        <div className={styles.fileInfo}>
                            <FileImage size={20} />
                            <span className={styles.fileName}>{selectedFile.name}</span>
                            <span className={styles.fileSize}>
                                ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFile}
                            leftIcon={<X size={16} />}
                        >
                            Remove
                        </Button>
                    </div>

                    {preview && (
                        <div className={styles.imagePreview}>
                            <img src={preview} alt="Preview" className={styles.previewImage} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
