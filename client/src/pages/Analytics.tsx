import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function Analytics() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Fetch analytics from API
      // const response = await api.analytics.get.query({
      //   dateStart: dateRange.start,
      //   dateEnd: dateRange.end,
      // });
      // setStats(response);
      console.log("Loading analytics...");
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">الإحصائيات والتحليلات</h1>
          <p className="text-gray-600 mt-2">تحليل شامل لأنشطتك وملاحظاتك</p>
        </div>

        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  من التاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  إلى التاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "جاري التحميل..." : "تحديث"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        {!loading && stats ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">إجمالي الملاحظات</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.totalEntries || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">ملاحظات صوتية</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {stats.audioEntries || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">صور</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {stats.imageEntries || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">ملاحظات نصية</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {stats.textEntries || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    توزيع التصنيفات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.categoryDistribution &&
                      Object.entries(stats.categoryDistribution).map(([category, count]: [string, any]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{
                                  width: `${(count / (stats.totalEntries || 1)) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    النشاط اليومي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.dailyActivity &&
                      Object.entries(stats.dailyActivity).map(([date, count]: [string, any]) => (
                        <div key={date} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{date}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600"
                                style={{
                                  width: `${Math.min((count / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>الرؤى والتوصيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.insights && stats.insights.length > 0 ? (
                    stats.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">✓ {insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">لا توجد رؤى متاحة حالياً</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

