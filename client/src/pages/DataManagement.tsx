import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Download, Trash2, Lock } from "lucide-react";

export default function DataManagement() {
  const [, navigate] = useLocation();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmExport, setShowConfirmExport] = useState(false);
  const [dataRetention, setDataRetention] = useState("30");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExportData = async () => {
    try {
      setLoading(true);
      // TODO: Call API to export data
      setMessage({ type: "success", text: "تم تصدير بيانات بنجاح" });
      setShowConfirmExport(false);
    } catch (error) {
      setMessage({ type: "error", text: "فشل تصدير البيانات" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async () => {
    try {
      setLoading(true);
      // TODO: Call API to delete data
      setMessage({ type: "success", text: "تم حذف البيانات بنجاح" });
      setShowConfirmDelete(false);
    } catch (error) {
      setMessage({ type: "error", text: "فشل حذف البيانات" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRetention = async () => {
    try {
      setLoading(true);
      // TODO: Call API to update retention policy
      setMessage({ type: "success", text: "تم تحديث سياسة الاحتفاظ بالبيانات" });
    } catch (error) {
      setMessage({ type: "error", text: "فشل تحديث السياسة" });
    } finally {
      setLoading(false);
    }
  };

  const messageClass = message
    ? message.type === "success"
      ? "bg-green-50 text-green-800 border-2 border-green-200"
      : "bg-red-50 text-red-800 border-2 border-red-200"
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/settings")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">إدارة البيانات والخصوصية</h1>
          <p className="text-gray-600 mt-2">تحكم في بيانتك الشخصية وخصوصيتك</p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageClass}`}>
            {message.text}
          </div>
        )}

        {/* Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              سياسة الاحتفاظ بالبيانات
            </CardTitle>
            <CardDescription>
              حدد كم يوماً تريد الاحتفاظ بالبيانات قبل حذفها تلقائياً
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                مدة الاحتفاظ (بالأيام)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Button
                  onClick={handleUpdateRetention}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "جاري التحديث..." : "تحديث"}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                سيتم حذف الملاحظات القديمة تلقائياً بعد {dataRetention} يوم
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              تصدير البيانات
            </CardTitle>
            <CardDescription>
              احصل على نسخة من جميع بيانتك الشخصية بصيغة JSON
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                يمكنك تحميل نسخة من جميع بيانتك الشخصية بما فيها:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>جميع الملاحظات والتسجيلات الصوتية</li>
                <li>الملخصات اليومية</li>
                <li>التذكيرات والأحداث</li>
                <li>جهات الاتصال</li>
                <li>الإعدادات والتفضيلات</li>
              </ul>
              {!showConfirmExport ? (
                <Button
                  onClick={() => setShowConfirmExport(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير البيانات
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    هل أنت متأكد من رغبتك في تصدير البيانات؟
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportData}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "جاري التصدير..." : "نعم، تصدير"}
                    </Button>
                    <Button
                      onClick={() => setShowConfirmExport(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              حذف جميع البيانات
            </CardTitle>
            <CardDescription>
              حذف جميع بيانتك الشخصية بشكل دائم. هذا الإجراء لا يمكن التراجع عنه.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <p className="text-sm text-red-900 font-medium">
                  تحذير: هذا الإجراء سيحذف جميع بيانتك بشكل دائم ولا يمكن التراجع عنه
                </p>
              </div>
              {!showConfirmDelete ? (
                <Button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف جميع البيانات
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    هل أنت متأكد تماماً من رغبتك في حذف جميع البيانات؟
                  </p>
                  <p className="text-sm text-gray-600">
                    سيتم حذف جميع الملاحظات والملخصات والتذكيرات وجميع البيانات الأخرى.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteData}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {loading ? "جاري الحذف..." : "نعم، احذف كل شيء"}
                    </Button>
                    <Button
                      onClick={() => setShowConfirmDelete(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

