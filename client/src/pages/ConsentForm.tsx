import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ConsentForm() {
  const [, navigate] = useLocation();
  const [consents, setConsents] = useState({
    dataCollection: false,
    audioProcessing: false,
    imageProcessing: false,
    summaryGeneration: false,
    reminderNotifications: false,
    privacyPolicy: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const allConsented = Object.values(consents).every(v => v);

  const handleConsent = (key: keyof typeof consents) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!allConsented) {
      alert("يرجى الموافقة على جميع الشروط");
      return;
    }

    try {
      // TODO: Submit consent via API
      // await api.settings.giveConsent.mutate();
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Failed to submit consent:", error);
      alert("فشل تسجيل الموافقة");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">شكراً لك</h2>
            <p className="text-gray-600">تم تسجيل موافقتك بنجاح. جاري التوجيه...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">نموذج الموافقة</h1>
          <p className="text-gray-600 mt-2">يرجى قراءة وقبول الشروط والأحكام</p>
        </div>

        {/* Warning */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">تنبيه مهم</h3>
                <p className="text-sm text-yellow-800">
                  هذا النظام لا يَحل محلّ التشخيص الطبي أو نصيحة الطوارئ. في حالة الطوارئ، يرجى الاتصال برقم الطوارئ المحلي فوراً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>الموافقات المطلوبة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "dataCollection",
                title: "جمع البيانات",
                description: "أوافق على جمع ملاحظاتي الصوتية والصور والملاحظات النصية",
              },
              {
                key: "audioProcessing",
                title: "معالجة الصوت",
                description: "أوافق على تحويل الملاحظات الصوتية إلى نصوص محلياً",
              },
              {
                key: "imageProcessing",
                title: "معالجة الصور",
                description: "أوافق على تصنيف الصور تلقائياً",
              },
              {
                key: "summaryGeneration",
                title: "توليد الملخصات",
                description: "أوافق على توليد ملخصات يومية من ملاحظاتي",
              },
              {
                key: "reminderNotifications",
                title: "التذكيرات والإشعارات",
                description: "أوافق على تلقي التذكيرات والإشعارات بناءً على جدول زمني",
              },
              {
                key: "privacyPolicy",
                title: "سياسة الخصوصية",
                description: "قرأت وأوافق على سياسة الخصوصية",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => handleConsent(item.key as keyof typeof consents)}
              >
                <input
                  type="checkbox"
                  checked={consents[item.key as keyof typeof consents]}
                  onChange={() => handleConsent(item.key as keyof typeof consents)}
                  className="w-5 h-5 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1 h-12"
          >
            رفض
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allConsented}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            قبول والمتابعة
          </Button>
        </div>
      </div>
    </div>
  );
}

