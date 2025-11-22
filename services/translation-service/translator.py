"""
Translator module for medical terminology translation.
"""
import pandas as pd
import os
from typing import List, Dict, Optional
import logging
from Levenshtein import ratio

logger = logging.getLogger(__name__)


from transformers import pipeline

class HuggingFaceTranslator:
    def __init__(self, model_name="Helsinki-NLP/opus-mt-zh-en", device="cpu"):
        self.device = 0 if device == "cuda" else -1
        try:
            self.pipe = pipeline("translation", model=model_name, device=self.device)
            logger.info(f"Loaded translation model: {model_name}")
        except Exception as e:
            logger.error(f"Failed to load translation model: {e}")
            self.pipe = None

    def translate(self, text: str) -> str:
        if not self.pipe:
            return text
        try:
            # Split long text if necessary, here we assume short segments for PoC
            result = self.pipe(text)
            return result[0]['translation_text']
        except Exception as e:
            logger.error(f"NMT translation failed: {e}")
            return text

class MedicalTranslator:
    def __init__(self, terminology_path: str = None):
        """
        Initialize medical translator with terminology database and NMT model.
        """
        self.terminology_path = (
            terminology_path or
            "/app/data/glossary/medical-terms.csv"
        )
        self.terms_df = None
        self.load_terminology()
        
        # Initialize NMT
        self.nmt = HuggingFaceTranslator()

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
        Translate text using NMT + Medical Terminology.
        """
        # 1. Perform NMT translation first
        nmt_result = self.nmt.translate(text)
        
        # 2. Terminology matching (for highlighting/verification)
        matched_terms = []
        
        if self.terms_df is not None and len(self.terms_df) > 0:
            # Exact matching on source text to find medical terms
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

        return {
            "translated_text": nmt_result,
            "matched_terms": matched_terms,
            "original_text": text
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
