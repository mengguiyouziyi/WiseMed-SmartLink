"""
Translator module for medical terminology translation.
"""
import pandas as pd
import os
from typing import List, Dict, Optional
import logging
from Levenshtein import ratio

logger = logging.getLogger(__name__)


class MedicalTranslator:
    def __init__(self, terminology_path: str = None):
        """
        Initialize medical translator with terminology database.

        Args:
            terminology_path: Path to medical terms CSV file
        """
        self.terminology_path = (
            terminology_path or
            "/app/data/glossary/medical-terms.csv"
        )
        self.terms_df = None
        self.load_terminology()

    def load_terminology(self):
        """Load medical terminology from CSV file."""
        if os.path.exists(self.terminology_path):
            try:
                self.terms_df = pd.read_csv(self.terminology_path)
                logger.info(
                    f"Loaded {len(self.terms_df)} medical terms from "
                    f"{self.terminology_path}"
                )
            except Exception as e:
                logger.error(f"Failed to load terminology: {e}")
                self.terms_df = pd.DataFrame(
                    columns=["chinese", "dialect", "english", "notes"]
                )
        else:
            logger.warning(
                f"Terminology file not found: {self.terminology_path}"
            )
            self.terms_df = pd.DataFrame(
                columns=["chinese", "dialect", "english", "notes"]
            )

    def translate(
        self,
        text: str,
        source_lang: str = "zh",
        target_lang: str = "en",
        fuzzy_match: bool = True,
        threshold: float = 0.8
    ) -> Dict:
        """
        Translate text using medical terminology matching.

        Args:
            text: Input text to translate
            source_lang: Source language code
            target_lang: Target language code
            fuzzy_match: Enable fuzzy matching
            threshold: Fuzzy match threshold (0-1)

        Returns:
            dict with 'translated_text' and 'matched_terms'
        """
        if self.terms_df is None or len(self.terms_df) == 0:
            return {
                "translated_text": text,
                "matched_terms": []
            }

        matched_terms = []
        translated_text = text

        # Exact matching first
        for _, row in self.terms_df.iterrows():
            source_term = row.get("chinese", "")
            target_term = row.get("english", "")

            if source_term and source_term in text:
                matched_terms.append({
                    "term": source_term,
                    "translation": target_term,
                    "confidence": 1.0,
                    "match_type": "exact"
                })
                translated_text = translated_text.replace(
                    source_term,
                    target_term
                )

        # Fuzzy matching for unmatched parts
        if fuzzy_match:
            words = text.split()
            for word in words:
                if len(word) < 2:
                    continue

                best_match = None
                best_score = 0.0

                for _, row in self.terms_df.iterrows():
                    source_term = row.get("chinese", "")
                    if not source_term:
                        continue

                    score = ratio(word, source_term)
                    if score > threshold and score > best_score:
                        best_score = score
                        best_match = row

                if best_match is not None:
                    matched_terms.append({
                        "term": word,
                        "translation": best_match.get("english", ""),
                        "confidence": best_score,
                        "match_type": "fuzzy"
                    })

        return {
            "translated_text": translated_text,
            "matched_terms": matched_terms
        }

    def search_terms(
        self,
        query: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """
        Search medical terminology database.

        Args:
            query: Search query (searches in all fields)
            limit: Maximum number of results

        Returns:
            List of matching terms
        """
        if self.terms_df is None or len(self.terms_df) == 0:
            return []

        if query:
            # Search in all columns
            mask = self.terms_df.apply(
                lambda row: any(
                    query.lower() in str(val).lower()
                    for val in row.values
                ),
                axis=1
            )
            results = self.terms_df[mask].head(limit)
        else:
            results = self.terms_df.head(limit)

        return results.to_dict('records')
