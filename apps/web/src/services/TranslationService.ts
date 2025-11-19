import { api } from '@/lib/api';

export interface TranscriptionResult {
    text: string;
    language: string;
    confidence?: number;
}

export interface TranslationResult {
    original_text: string;
    translated_text: string;
    matched_terms: Array<{
        term: string;
        translation: string;
        confidence: number;
    }>;
}

class TranslationServiceClass {
    async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        return api.upload<TranscriptionResult>('/translate/asr/transcribe', formData);
    }

    async translateText(text: string, sourceLang: string = 'zh', targetLang: string = 'en'): Promise<TranslationResult> {
        return api.post<TranslationResult>('/translate/translate', {
            text,
            source_lang: sourceLang,
            target_lang: targetLang,
        });
    }
}

export const TranslationService = new TranslationServiceClass();
