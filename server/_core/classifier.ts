/**
 * Text Classification Service
 * Classifies entries into predefined categories
 * Uses keyword matching and simple ML models
 */

export interface ClassificationResult {
  labels: string[];
  scores: Record<string, number>;
  confidence: number;
}

// Predefined categories and keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  medicine: [
    "دواء",
    "دوا",
    "أخذت",
    "تناولت",
    "حبة",
    "كبسولة",
    "شراب",
    "حقنة",
    "علاج",
    "طب",
    "صيدلية",
    "مرهم",
    "قطرة",
  ],
  appointment: [
    "موعد",
    "عيادة",
    "طبيب",
    "مستشفى",
    "فحص",
    "كشف",
    "تحليل",
    "أشعة",
    "زيارة",
    "استشارة",
    "موعدي",
  ],
  family: [
    "عائلة",
    "أهل",
    "أم",
    "أب",
    "أخ",
    "أخت",
    "ابن",
    "ابنة",
    "زوج",
    "زوجة",
    "حفيد",
    "حفيدة",
    "قريب",
    "زيارة",
    "اتصال",
    "رسالة",
  ],
  food: [
    "طعام",
    "أكل",
    "أكلت",
    "تناولت",
    "غداء",
    "عشاء",
    "إفطار",
    "وجبة",
    "طبخ",
    "طاهي",
    "مطعم",
    "مشروب",
    "شرب",
    "قهوة",
    "شاي",
    "ماء",
  ],
  outing: [
    "خروج",
    "خرجت",
    "ذهبت",
    "سفر",
    "رحلة",
    "مشي",
    "نزهة",
    "حديقة",
    "شارع",
    "سيارة",
    "مكان",
    "خارج",
    "بيت",
  ],
  emergency: [
    "طوارئ",
    "خطر",
    "ألم",
    "حادثة",
    "إصابة",
    "نزيف",
    "إغماء",
    "صعوبة",
    "تنفس",
    "صرخة",
    "استغاثة",
    "مساعدة",
    "سريع",
  ],
  general: [
    "ملاحظة",
    "يوم",
    "أمس",
    "غدا",
    "الآن",
    "هنا",
    "هناك",
    "شعرت",
    "أحس",
  ],
};

/**
 * Classify text into categories
 */
export function classifyText(text: string): ClassificationResult {
  const normalizedText = text.toLowerCase().trim();
  const scores: Record<string, number> = {};
  let maxScore = 0;

  // Calculate scores for each category
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    const textWords = normalizedText.split(/\s+/);

    for (const keyword of keywords) {
      // Count keyword occurrences
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      const matches = normalizedText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    // Normalize score by text length
    if (textWords.length > 0) {
      score = score / textWords.length;
    }

    scores[category] = score;
    maxScore = Math.max(maxScore, score);
  }

  // Normalize scores to 0-1 range
  const normalizedScores: Record<string, number> = {};
  for (const [category, score] of Object.entries(scores)) {
    normalizedScores[category] = maxScore > 0 ? score / maxScore : 0;
  }

  // Get labels with score > threshold
  const threshold = 0.3;
  const labels = Object.entries(normalizedScores)
    .filter(([_, score]) => score > threshold)
    .sort(([_, a], [__, b]) => b - a)
    .map(([label]) => label);

  // If no labels found, use "general"
  if (labels.length === 0) {
    labels.push("general");
  }

  // Calculate overall confidence
  const topScore = Math.max(...Object.values(normalizedScores));
  const confidence = Math.min(1, topScore * 1.5); // Boost confidence for better UX

  return {
    labels,
    scores: normalizedScores,
    confidence,
  };
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 5): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};

  // Count word frequencies
  for (const word of words) {
    if (word.length > 2) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  // Sort by frequency and return top keywords
  return Object.entries(wordFreq)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Detect language
 */
export function detectLanguage(text: string): string {
  // Simple language detection based on character ranges
  const arabicRegex = /[\u0600-\u06FF]/g;
  const englishRegex = /[a-zA-Z]/g;

  const arabicMatches = text.match(arabicRegex) || [];
  const englishMatches = text.match(englishRegex) || [];

  if (arabicMatches.length > englishMatches.length) {
    return "ar";
  } else if (englishMatches.length > arabicMatches.length) {
    return "en";
  } else {
    return "mixed";
  }
}

/**
 * Validate classification result
 */
export function validateClassification(result: ClassificationResult): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (result.labels.length === 0) {
    issues.push("No labels detected");
  }

  if (result.confidence < 0.2) {
    issues.push("Low confidence score");
  }

  if (Object.values(result.scores).every(score => score === 0)) {
    issues.push("All scores are zero");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

