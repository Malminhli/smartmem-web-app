import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/settings")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">سياسة الخصوصية</h1>
          <p className="text-gray-600 mt-2">نظام ذِكر — SmartMem</p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6 text-right">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. المقدمة</h2>
                <p className="text-gray-700">
                  نحن نلتزم بحماية خصوصيتك وأمان بيانات حسابك. هذه السياسة توضح كيفية نحن نجمع ونستخدم بيانات حسابك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. البيانات التي نجمعها</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>الملاحظات الصوتية والصور والملاحظات النصية</li>
                  <li>معلومات التذكيرات والأحداث</li>
                  <li>بيانات جهات الاتصال الموثوقة</li>
                  <li>معلومات الملخصات اليومية</li>
                  <li>سجلات النشاط</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. كيفية استخدام البيانات</h2>
                <p className="text-gray-700">نستخدم بيانات حسابك فقط لـ:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>توليد ملخصات يومية</li>
                  <li>إرسال التذكيرات</li>
                  <li>تحسين خدماتنا</li>
                  <li>الامتثال للقوانين واللوائح</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. الأمان والتشفير</h2>
                <p className="text-gray-700">
                  جميع بيانات حسابك مشفرة باستخدام معايير التشفير AES-256. نحن لا نشارك بيانات حسابك مع أي جهة خارجية بدون موافقتك الصريحة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. حقوقك</h2>
                <p className="text-gray-700">لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>الوصول إلى بيانات حسابك</li>
                  <li>تحميل نسخة من بيانات حسابك</li>
                  <li>حذف جميع بيانات حسابك</li>
                  <li>تعديل معلومات حسابك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. التنبيهات</h2>
                <p className="text-gray-700">
                  هذا النظام لا يَحل محلّ التشخيص الطبي أو نصيحة الطوارئ. في حالة الطوارئ، يرجى الاتصال برقم الطوارئ المحلي فوراً.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. التواصل معنا</h2>
                <p className="text-gray-700">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

