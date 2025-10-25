import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useRoute } from "wouter";
import { Download, Share2, ChevronLeft, ChevronRight } from "lucide-react";

export default function DailySummary() {
  const [, navigate] = useLocation();
  const [route, params] = useRoute("/summary/:date");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadSummary();
  }, [currentDate]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const dateStr = currentDate.toISOString().split("T")[0];
      // TODO: Fetch from API
      // const response = await api.summaries.get.query({ date: dateStr });
      // setSummary(response);
      console.log("Loading summary for:", dateStr);
    } catch (error) {
      console.error("Failed to load summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const previousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const exportSummary = async () => {
    try {
      // TODO: Export to PDF or text
      const dateStr = currentDate.toISOString().split("T")[0];
      // const response = await api.summaries.export.query({ date: dateStr, format: "text" });
      alert("سيتم تحميل الملخص قريباً");
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">ملخص اليوم</h1>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button onClick={previousDay} variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{formatDate(currentDate)}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentDate.toISOString().split("T")[0]}
                </p>
              </div>
              <Button onClick={nextDay} variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الملخص...</p>
            </div>
          </div>
        ) : summary ? (
          <>
            {/* Summary Text */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>ملخص اليوم</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {summary.summary}
                </p>
              </CardContent>
            </Card>

            {/* Events Timeline */}
            {summary.events && summary.events.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>الأحداث والملاحظات</CardTitle>
                  <CardDescription>
                    {summary.events.length} ملاحظات مسجلة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summary.events.map((event: any, idx: number) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                            <span className="text-sm font-semibold text-blue-600">
                              {event.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{event.label}</Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {summary.keywordCounts && Object.keys(summary.keywordCounts).length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>إحصائيات التصنيفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(summary.keywordCounts).map(([label, count]: [string, any]) => (
                      <div key={label} className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="text-2xl font-bold text-blue-600">{count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-600 mb-4">لا توجد ملاحظات مسجلة في هذا اليوم</p>
              <Button onClick={() => navigate("/entry/new")}>إضافة ملاحظة</Button>
            </CardContent>
          </Card>
        )}

        {/* Export Button */}
        {summary && (
          <div className="flex gap-4 mt-8">
            <Button
              onClick={exportSummary}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل الملخص
            </Button>
            <Button
              onClick={() => alert("سيتم إضافة مشاركة قريباً")}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

