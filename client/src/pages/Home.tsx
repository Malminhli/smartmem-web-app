import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Mic, Camera, FileText, Heart, Shield, Zap } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  // إذا كان المستخدم مسجل دخول، انقله إلى لوحة التحكم
  if (isAuthenticated && !loading) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-lg" />
            <span className="text-2xl font-bold text-gray-900">{APP_TITLE}</span>
          </div>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            دخول
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                ذِكر — SmartMem
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نظام ذكي لمساعدة كبار السن وذوي ضعف الذاكرة على تنظيم حياتهم اليومية بسهولة وأمان
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
            >
              ابدأ الآن
            </Button>
            <Button
              onClick={() => navigate("/about")}
              variant="outline"
              className="px-8 py-3 rounded-lg font-semibold text-lg"
            >
              عن المشروع
            </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-8 text-white">
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <p className="text-sm opacity-90">📝 ملاحظة صوتية</p>
                    <p className="text-lg font-semibold">تم تسجيل الملاحظة بنجاح</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <p className="text-sm opacity-90">⏰ تذكير</p>
                    <p className="text-lg font-semibold">موعد الدواء في 30 دقيقة</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <p className="text-sm opacity-90">📊 ملخص اليوم</p>
                    <p className="text-lg font-semibold">5 ملاحظات مسجلة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            الميزات الرئيسية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">تسجيل صوتي</h3>
              <p className="text-gray-600">
                سجل ملاحظاتك الصوتية وسيتم تحويلها تلقائياً إلى نصوص
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">التقاط صور</h3>
              <p className="text-gray-600">
                التقط صوراً للأشياء المهمة وسيتم تصنيفها تلقائياً
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ملاحظات نصية</h3>
              <p className="text-gray-600">
                اكتب ملاحظاتك مباشرة وسهلة الاستخدام
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">تذكيرات ذكية</h3>
              <p className="text-gray-600">
                احصل على تذكيرات في الوقت المناسب لأنشطتك اليومية
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ملخصات يومية</h3>
              <p className="text-gray-600">
                احصل على ملخص شامل لكل يوم مع الإحصائيات
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">أمان عالي</h3>
              <p className="text-gray-600">
                بيانات مشفرة بالكامل وخصوصية محمية 100%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            كيفية الاستخدام
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سجل دخول</h3>
              <p className="text-gray-600">
                أنشئ حسابك أو سجل دخول بسهولة
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أضف ملاحظات</h3>
              <p className="text-gray-600">
                سجل ملاحظاتك بالصوت أو الصورة أو النص
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">احصل على تذكيرات</h3>
              <p className="text-gray-600">
                استقبل تذكيرات ذكية في الوقت المناسب
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">اعرض الملخصات</h3>
              <p className="text-gray-600">
                اطلع على ملخصات يومية شاملة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف المستخدمين الذين يستخدمون SmartMem لتنظيم حياتهم
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-6 px-8 font-bold"
          >
            ابدأ الآن مجاناً
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">عن SmartMem</h3>
              <p className="text-gray-400">
                نظام ذكي لمساعدة كبار السن على تنظيم حياتهم اليومية
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">الروابط</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">الرئيسية</a></li>
                <li><a href="#" className="hover:text-white">الميزات</a></li>
                <li><a href="#" className="hover:text-white">الأسعار</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">القانونية</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">الخصوصية</a></li>
                <li><a href="#" className="hover:text-white">الشروط</a></li>
                <li><a href="#" className="hover:text-white">الاتصال</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">التواصل</h3>
              <p className="text-gray-400">
                support@smartmem.app<br/>
                +966 XX XXX XXXX
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SmartMem. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

