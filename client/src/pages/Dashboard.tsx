import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Mic, Camera, FileText, Plus, Calendar, Bell, Users, Settings, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { data: entriesData, isLoading: entriesLoading, refetch } = trpc.entries.list.useQuery({
    limit: 10,
    offset: 0,
  });

  const { data: summaryData } = trpc.summaries.get.useQuery({
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (entriesData?.entries) {
      setEntries(entriesData.entries);
    }
    setLoading(entriesLoading);
  }, [entriesData, entriesLoading]);

  useEffect(() => {
    if (summaryData) {
      setSummary(summaryData);
    }
  }, [summaryData]);

  // Refresh entries when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const quickActionButtons = [
    { icon: Mic, label: "تسجيل صوتي", action: () => navigate("/new-entry") },
    { icon: Camera, label: "التقاط صورة", action: () => navigate("/new-entry") },
    { icon: FileText, label: "ملاحظة نصية", action: () => navigate("/new-entry") },
  ];

  const navigationItems = [
    { icon: Calendar, label: "الملخصات اليومية", path: "/daily-summary" },
    { icon: Bell, label: "التذكيرات", path: "/reminders" },
    { icon: Users, label: "جهات الاتصال", path: "/contacts" },
    { icon: Settings, label: "الإعدادات", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">مرحباً بك في ذِكر</h1>
          <p className="text-gray-600">نظام ذكي لمساعدتك على تنظيم ذاكرتك</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActionButtons.map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <Button
                key={idx}
                onClick={btn.action}
                className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-blue-50 text-gray-900 border-2 border-blue-200 rounded-lg"
              >
                <Icon className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium">{btn.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Today's Summary */}
        {summary && summary.summary && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle>ملخص اليوم</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("ar-SA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{summary.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>الملاحظات الأخيرة</CardTitle>
                <CardDescription>آخر الملاحظات المضافة</CardDescription>
              </div>
              <Button
                onClick={() => navigate("/search")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Search className="w-4 h-4 mr-2" />
                بحث
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">جاري التحميل...</p>
            ) : entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((entry: any, idx: number) => {
                  const Icon =
                    entry.type === "audio"
                      ? Mic
                      : entry.type === "image"
                        ? Camera
                        : FileText;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {entry.transcript ? entry.transcript.substring(0, 100) : `${entry.type} entry`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.timestamp || entry.createdAt).toLocaleString("ar-SA")}
                        </p>
                        {entry.labels && entry.labels.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {entry.labels.map((label: string, lidx: number) => (
                              <Badge key={lidx} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                لا توجد ملاحظات حتى الآن. ابدأ بإضافة ملاحظة جديدة!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Button
                key={idx}
                onClick={() => navigate(item.path)}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50"
              >
                <Icon className="w-6 h-6 text-blue-600" />
                <span className="text-xs text-center">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

