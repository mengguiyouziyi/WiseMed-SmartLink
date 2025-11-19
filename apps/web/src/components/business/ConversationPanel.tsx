'use client';

import React from 'react';
import styles from './ConversationPanel.module.css';

export interface Message {
    id: string;
    originalText: string;
    translatedText: string;
    matchedTerms: Array<{
        term: string;
        translation: string;
        confidence: number;
    }>;
    timestamp: Date;
}

interface ConversationPanelProps {
    messages: Message[];
}

export function ConversationPanel({ messages }: ConversationPanelProps) {
    const highlightTerms = (text: string, terms: Message['matchedTerms']) => {
        if (terms.length === 0) return text;

        let highlightedText = text;
        terms.forEach((term) => {
            const regex = new RegExp(`(${term.term})`, 'g');
            highlightedText = highlightedText.replace(
                regex,
                `<mark class="${styles.highlight}" title="${term.translation}">${term.term}</mark>`
            );
        });

        return highlightedText;
    };

    return (
        <div className={styles.container}>
            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No conversation yet. Start recording to begin.</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className={styles.message}>
                            <div className={styles.messageHeader}>
                                <span className={styles.timestamp}>
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>

                            <div className={styles.messageBody}>
                                <div className={styles.originalText}>
                                    <span className={styles.label}>Original (中文):</span>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: highlightTerms(message.originalText, message.matchedTerms),
                                        }}
                                    />
                                </div>

                                <div className={styles.translatedText}>
                                    <span className={styles.label}>Translation (English):</span>
                                    <p>{message.translatedText}</p>
                                </div>
                            </div>

                            {message.matchedTerms.length > 0 && (
                                <div className={styles.terms}>
                                    <span className={styles.termsLabel}>Medical Terms:</span>
                                    <div className={styles.termsList}>
                                        {message.matchedTerms.map((term, idx) => (
                                            <span key={idx} className={styles.termBadge}>
                                                {term.term} → {term.translation}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
