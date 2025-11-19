import { api } from '@/lib/api';

export interface InferenceResult {
    filename: string;
    prediction: 'benign' | 'malignant' | string;
    confidence: number;
    model_version: string;
    bounding_boxes?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        confidence: number;
    }>;
}

class InferenceServiceClass {
    async analyzeLungNodule(file: File): Promise<InferenceResult> {
        const formData = new FormData();
        formData.append('file', file);

        return api.upload<InferenceResult>('/infer/lung-nodule', formData);
    }
}

export const InferenceService = new InferenceServiceClass();
