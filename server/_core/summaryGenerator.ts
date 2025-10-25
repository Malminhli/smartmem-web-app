/**
 * Summary Generation Service
 * Creates intelligent daily summaries from entries
 */

export interface SummaryInput {
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>;
  date: string; // YYYY-MM-DD
  language: string;
}

export interface GeneratedSummary {
  date: string;
  summary: string;
  highlights: string[];
  keyEvents: Array<{
    time: string;
    label: string;
    description: string;
  }>;
  statistics: Record<string, number>;
  recommendations: string[];
}

/**
 * Generate a daily summary
 */
export function generateDailySummary(input: SummaryInput): GeneratedSummary {
  const { entries, date, language } = input;

  // Sort entries by time
  const sortedEntries = entries.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Extract statistics
  const statistics = calculateStatistics(sortedEntries);

  // Generate summary text
  const summary = generateSummaryText(sortedEntries, language);

  // Extract highlights
  const highlights = extractHighlights(sortedEntries);

  // Format key events
  const keyEvents = formatKeyEvents(sortedEntries);

  // Generate recommendations
  const recommendations = generateRecommendations(sortedEntries, language);

  return {
    date,
    summary,
    highlights,
    keyEvents,
    statistics,
    recommendations,
  };
}

/**
 * Calculate statistics from entries
 */
function calculateStatistics(
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>
): Record<string, number> {
  const stats: Record<string, number> = {
    totalEntries: entries.length,
    audioEntries: 0,
    imageEntries: 0,
    textEntries: 0,
  };

  const labelCounts: Record<string, number> = {};

  for (const entry of entries) {
    // Count entry types
    if (entry.type === "audio") stats.audioEntries++;
    else if (entry.type === "image") stats.imageEntries++;
    else if (entry.type === "text") stats.textEntries++;

    // Count labels
    for (const label of entry.labels) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }
  }

  // Add label counts to statistics
  for (const [label, count] of Object.entries(labelCounts)) {
    stats[`label_${label}`] = count;
  }

  return stats;
}

/**
 * Generate summary text in Arabic
 */
function generateSummaryText(
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>,
  language: string
): string {
  const lines: string[] = [];

  if (entries.length === 0) {
    return language === "ar" ? "لا توجد ملاحظات مسجلة في هذا اليوم" : "No entries recorded today";
  }

  // Count labels
  const labelCounts: Record<string, number> = {};
  for (const entry of entries) {
    for (const label of entry.labels) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }
  }

  // Generate summary
  if (language === "ar") {
    lines.push(`ملخص اليوم: تم تسجيل ${entries.length} ملاحظات`);

    if (Object.keys(labelCounts).length > 0) {
      lines.push("الفئات المسجلة:");
      for (const [label, count] of Object.entries(labelCounts)) {
        lines.push(`  • ${label}: ${count}`);
      }
    }

    // Add specific insights
    if (labelCounts["medicine"]) {
      lines.push("✓ تم تسجيل تناول الأدوية");
    }

    if (labelCounts["appointment"]) {
      lines.push("✓ تم تسجيل مواعيد طبية");
    }

    if (labelCounts["family"]) {
      lines.push("✓ تم تسجيل تفاعلات عائلية");
    }
  } else {
    lines.push(`Summary: ${entries.length} entries recorded today`);

    if (Object.keys(labelCounts).length > 0) {
      lines.push("Categories recorded:");
      for (const [label, count] of Object.entries(labelCounts)) {
        lines.push(`  • ${label}: ${count}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Extract highlights from entries
 */
function extractHighlights(
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>
): string[] {
  const highlights: string[] = [];

  // Find entries with high-priority labels
  const priorityLabels = ["emergency", "appointment", "medicine"];

  for (const entry of entries) {
    for (const label of entry.labels) {
      if (priorityLabels.includes(label) && entry.transcript) {
        highlights.push(entry.transcript.substring(0, 100));
      }
    }
  }

  return highlights.slice(0, 5); // Return top 5 highlights
}

/**
 * Format key events
 */
function formatKeyEvents(
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>
): Array<{
  time: string;
  label: string;
  description: string;
}> {
  return entries.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    label: entry.labels[0] || "عام",
    description: entry.transcript?.substring(0, 100) || `${entry.type} entry`,
  }));
}

/**
 * Generate recommendations based on entries
 */
function generateRecommendations(
  entries: Array<{
    id: string;
    transcript?: string;
    labels: string[];
    timestamp: Date;
    type: "audio" | "image" | "text";
  }>,
  language: string
): string[] {
  const recommendations: string[] = [];
  const labelCounts: Record<string, number> = {};

  for (const entry of entries) {
    for (const label of entry.labels) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }
  }

  if (language === "ar") {
    if (!labelCounts["medicine"]) {
      recommendations.push("تذكر: لم تسجل تناول أي أدوية اليوم");
    }

    if (!labelCounts["food"]) {
      recommendations.push("تذكر: لم تسجل تناول وجبات اليوم");
    }

    if (entries.length < 3) {
      recommendations.push("حاول تسجيل المزيد من الملاحظات لتتبع أفضل");
    }

    if (labelCounts["emergency"]) {
      recommendations.push("⚠️ تم تسجيل حالة طوارئ - تأكد من الاتصال بالمسؤولين");
    }
  } else {
    if (!labelCounts["medicine"]) {
      recommendations.push("Reminder: No medication recorded today");
    }

    if (!labelCounts["food"]) {
      recommendations.push("Reminder: No meals recorded today");
    }

    if (entries.length < 3) {
      recommendations.push("Try recording more entries for better tracking");
    }

    if (labelCounts["emergency"]) {
      recommendations.push("⚠️ Emergency recorded - ensure proper authorities are notified");
    }
  }

  return recommendations;
}

/**
 * Validate summary
 */
export function validateSummary(summary: GeneratedSummary): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!summary.summary || summary.summary.trim().length === 0) {
    issues.push("Summary text is empty");
  }

  if (summary.keyEvents.length === 0) {
    issues.push("No key events found");
  }

  if (Object.keys(summary.statistics).length === 0) {
    issues.push("No statistics available");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

