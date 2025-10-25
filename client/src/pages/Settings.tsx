import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Download, Trash2, LogOut, Shield, Globe, Save } from "lucide-react";

export default function Settings() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState("ar");
  const [dataRetention, setDataRetention] = useState(90);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from API
      // const response = await api.settings.get.query();
      // setLanguage(response.language);
      // setDataRetention(response.dataRetentionDays);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // TODO: Save via API
      // await api.settings.update.mutate({ language, dataRetentionDays: dataRetention });
      alert("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("فشل حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      // TODO: Export via API
      // const response = await api.settings.exportData.query();
      alert("سيتم تحميل بيانات حسابك قريباً");
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const deleteAllData = async () => {
    if (!confirm("تحذير: هذا سيؤدي لحذف جميع بيانات حسابك بشكل دائم. هل أنت متأكد؟")) {
      return;
    }
    if (!confirm("هذا الإجراء لا يمكن التراجع عنه. هل تريد المتابعة؟")) {
      return;
    }
    try {
      // TODO: Delete via API
      // await api.settings.deleteAllData.mutate();
      alert("تم طلب حذف جميع بيانات حسابك. سيتم حذفها خلال 24 ساعة.");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete data:", error);
      alert("فشل حذف البيانات");
    }
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
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600 mt-2">إدارة تفضيلاتك والخصوصية</p>
        </div>

        {/* General Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                اللغة
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                مدة الاحتفاظ بالبيانات (أيام)
              </label>
              <input
                type="number"
                value={dataRetention}
                onChange={(e) => setDataRetention(parseInt(e.target.value))}
                min="7"
                max="365"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                سيتم حذف البيانات الأقدم من هذه المدة تلقائياً
              </p>
            </div>

            <Button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              الخصوصية والأمان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                جميع بيانات حسابك مشفرة ومحفوظة بشكل آمن. نحن لا نشارك بيانات حسابك مع أي جهة خارجية بدون موافقتك الصريحة.
              </p>
            </div>
            <Button
              onClick={() => navigate("/privacy")}
              variant="outline"
              className="w-full"
            >
              اقرأ سياسة الخصوصية
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إدارة البيانات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={exportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل نسخة من بيانات حسابي
            </Button>
            <Button
              onClick={deleteAllData}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف جميع البيانات
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                // TODO: Logout via API
                // await api.auth.logout.mutate();
                navigate("/");
              }}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

