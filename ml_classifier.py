#!/usr/bin/env python3
"""
SmartMem - Text and Audio Classification Module
تصنيف النصوص والصوت باستخدام نماذج التعلم الآلي المتقدمة
"""

import json
import os
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

# Import libraries
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    import torch
    import numpy as np
except ImportError:
    print("⚠️  تثبيت المكتبات المطلوبة...")
    os.system("pip install transformers torch numpy -q")
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    import torch
    import numpy as np


class SmartMemClassifier:
    """
    نظام تصنيف ذكي للملاحظات والمدخلات
    يدعم تصنيف النصوص والصوت تلقائياً
    """

    # التصنيفات المدعومة
    CATEGORIES = {
        "دواء": {
            "keywords": ["دواء", "حبة", "حبوب", "عقار", "دواء", "مضاد", "فيتامين", "كبسولة"],
            "emoji": "💊",
            "color": "#FF6B6B"
        },
        "موعد": {
            "keywords": ["موعد", "موعد الطبيب", "اجتماع", "حفل", "حفلة", "مناسبة", "تاريخ"],
            "emoji": "📅",
            "color": "#4ECDC4"
        },
        "عائلة": {
            "keywords": ["أم", "أب", "ابن", "ابنة", "أخ", "أخت", "زوج", "زوجة", "حفيد", "عائلة"],
            "emoji": "👨‍👩‍👧‍👦",
            "color": "#FFE66D"
        },
        "طعام": {
            "keywords": ["طعام", "أكل", "وجبة", "غداء", "عشاء", "فطور", "شراب", "ماء", "عصير"],
            "emoji": "🍽️",
            "color": "#95E1D3"
        },
        "خروج": {
            "keywords": ["خروج", "ذهاب", "سفر", "رحلة", "زيارة", "مشي", "تنزه", "سير"],
            "emoji": "🚶",
            "color": "#A8E6CF"
        },
        "صحة": {
            "keywords": ["صحة", "ألم", "حمى", "سعال", "زكام", "إرهاق", "تعب", "مرض"],
            "emoji": "⚕️",
            "color": "#FF8B94"
        },
        "ملاحظة": {
            "keywords": ["ملاحظة", "تذكر", "تذكير", "هام", "مهم", "ملحوظة"],
            "emoji": "📝",
            "color": "#B4A7D6"
        }
    }

    def __init__(self):
        """تهيئة نموذج التصنيف"""
        print("🔄 جاري تحميل نموذج التصنيف...")
        
        try:
            # استخدام نموذج متخصص للعربية
            self.classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=-1  # CPU
            )
            self.model_loaded = True
            print("✅ تم تحميل نموذج التصنيف بنجاح")
        except Exception as e:
            print(f"⚠️  خطأ في تحميل النموذج: {e}")
            self.model_loaded = False

    def classify_text(self, text: str) -> Dict:
        """
        تصنيف النص تلقائياً
        
        Args:
            text: النص المراد تصنيفه
            
        Returns:
            قاموس يحتوي على التصنيف والثقة والمعلومات الإضافية
        """
        if not text or len(text.strip()) == 0:
            return {
                "success": False,
                "error": "النص فارغ",
                "category": None,
                "confidence": 0
            }

        # تصنيف بناءً على الكلمات المفتاحية أولاً
        keyword_result = self._classify_by_keywords(text)
        if keyword_result["confidence"] > 0.7:
            return keyword_result

        # إذا لم نجد تطابقاً قوياً، استخدم النموذج
        if self.model_loaded:
            return self._classify_with_model(text)
        
        return keyword_result

    def _classify_by_keywords(self, text: str) -> Dict:
        """تصنيف بناءً على الكلمات المفتاحية"""
        text_lower = text.lower()
        scores = {}

        for category, info in self.CATEGORIES.items():
            score = 0
            for keyword in info["keywords"]:
                if keyword in text_lower:
                    score += 1
            scores[category] = score

        if max(scores.values()) > 0:
            best_category = max(scores, key=scores.get)
            confidence = min(scores[best_category] / 3, 1.0)  # تطبيع الثقة
            
            return {
                "success": True,
                "category": best_category,
                "emoji": self.CATEGORIES[best_category]["emoji"],
                "color": self.CATEGORIES[best_category]["color"],
                "confidence": confidence,
                "method": "keyword_matching"
            }

        return {
            "success": False,
            "category": "ملاحظة",
            "emoji": self.CATEGORIES["ملاحظة"]["emoji"],
            "color": self.CATEGORIES["ملاحظة"]["color"],
            "confidence": 0.3,
            "method": "default"
        }

    def _classify_with_model(self, text: str) -> Dict:
        """تصنيف باستخدام نموذج التعلم الآلي"""
        try:
            categories = list(self.CATEGORIES.keys())
            result = self.classifier(text, categories, multi_class=False)
            
            best_category = result["labels"][0]
            confidence = result["scores"][0]
            
            return {
                "success": True,
                "category": best_category,
                "emoji": self.CATEGORIES[best_category]["emoji"],
                "color": self.CATEGORIES[best_category]["color"],
                "confidence": float(confidence),
                "method": "ml_model",
                "all_scores": {
                    cat: float(score) 
                    for cat, score in zip(result["labels"], result["scores"])
                }
            }
        except Exception as e:
            print(f"⚠️  خطأ في التصنيف: {e}")
            return self._classify_by_keywords(text)

    def extract_keywords(self, text: str) -> List[str]:
        """استخراج الكلمات المفتاحية من النص"""
        # كلمات شائعة يجب تجاهلها
        stopwords = {
            "في", "من", "إلى", "هذا", "هذه", "ذلك", "تلك", "و", "أو", "لا",
            "نعم", "هو", "هي", "هم", "هن", "أن", "إن", "كان", "كانت"
        }
        
        words = text.split()
        keywords = [
            word.strip(".,!?؛:") 
            for word in words 
            if len(word) > 2 and word.lower() not in stopwords
        ]
        
        return list(set(keywords))[:5]  # أعلى 5 كلمات فريدة

    def generate_summary(self, texts: List[str]) -> Dict:
        """توليد ملخص من عدة نصوص"""
        if not texts:
            return {"summary": "", "keywords": [], "categories": {}}

        # جمع جميع الكلمات المفتاحية
        all_keywords = []
        category_counts = {}

        for text in texts:
            # تصنيف كل نص
            classification = self.classify_text(text)
            category = classification.get("category", "ملاحظة")
            
            category_counts[category] = category_counts.get(category, 0) + 1
            
            # استخراج الكلمات المفتاحية
            keywords = self.extract_keywords(text)
            all_keywords.extend(keywords)

        # حساب الكلمات الأكثر تكراراً
        from collections import Counter
        top_keywords = Counter(all_keywords).most_common(5)
        
        # بناء الملخص
        summary = f"تم تسجيل {len(texts)} ملاحظة. "
        if category_counts:
            main_category = max(category_counts, key=category_counts.get)
            summary += f"التصنيف الرئيسي: {main_category}. "
        
        summary += f"الكلمات المفتاحية: {', '.join([kw[0] for kw in top_keywords])}"

        return {
            "summary": summary,
            "keywords": [kw[0] for kw in top_keywords],
            "categories": category_counts,
            "total_entries": len(texts)
        }


class AudioProcessor:
    """معالج الملفات الصوتية"""

    @staticmethod
    def transcribe_audio(audio_path: str) -> Dict:
        """
        تحويل الصوت إلى نص
        
        Args:
            audio_path: مسار ملف الصوت
            
        Returns:
            قاموس يحتوي على النص والثقة
        """
        try:
            # محاكاة تحويل الصوت إلى نص
            # في الإنتاج، استخدم مكتبة مثل SpeechRecognition أو Whisper
            
            print(f"🎙️  معالجة الملف الصوتي: {audio_path}")
            
            # للاختبار، نرجع نص وهمي
            return {
                "success": True,
                "text": "هذا نص تم تحويله من الصوت",
                "confidence": 0.95,
                "language": "ar",
                "duration": 5.2
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "text": None
            }

    @staticmethod
    def detect_language(audio_path: str) -> str:
        """الكشف عن لغة الملف الصوتي"""
        # في الإنتاج، استخدم مكتبة متخصصة
        return "ar"  # افتراض اللغة العربية


# مثال على الاستخدام
if __name__ == "__main__":
    print("=" * 60)
    print("🧠 SmartMem - نظام التصنيف الذكي")
    print("=" * 60)

    # تهيئة المصنف
    classifier = SmartMemClassifier()

    # أمثلة على النصوص
    test_texts = [
        "أخذت الدواء في الصباح",
        "موعد الطبيب غداً الساعة 3",
        "أم اتصلت بي اليوم",
        "تناولت وجبة غداء لذيذة",
        "ذهبت في نزهة بالحديقة",
        "شعرت بألم في الرأس",
        "تذكر أن تشتري الحليب"
    ]

    print("\n📊 نتائج التصنيف:")
    print("-" * 60)

    for text in test_texts:
        result = classifier.classify_text(text)
        emoji = result.get("emoji", "📝")
        category = result.get("category", "غير محدد")
        confidence = result.get("confidence", 0)
        
        print(f"{emoji} النص: {text}")
        print(f"   ✓ التصنيف: {category}")
        print(f"   ✓ الثقة: {confidence:.1%}")
        print()

    # توليد ملخص
    print("\n📈 الملخص اليومي:")
    print("-" * 60)
    summary = classifier.generate_summary(test_texts)
    print(f"الملخص: {summary['summary']}")
    print(f"الكلمات المفتاحية: {', '.join(summary['keywords'])}")
    print(f"التصنيفات: {summary['categories']}")

    print("\n✅ انتهت المعالجة بنجاح!")

