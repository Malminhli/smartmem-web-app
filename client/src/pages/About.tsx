import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Mail, Phone, MapPin, Globe, Award, Users, Heart } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  const creatorInfo = {
    name: "محمد أحمد",
    email: "contact@smartmem.app",
    phone: "+966 50 123 4567",
    organization: "مدرسة الإبداع التقنية",
    purpose: "مسابقة إبداع 2026 - فئة التطبيقات الذكية",
    website: "www.smartmem.app",
  };

  const projectInfo = [
    {
      label: "اسم المشروع",
      value: "ذِكر — SmartMem",
      icon: "📱",
    },
    {
      label: "الغرض",
      value: "مساعدة كبار السن وذوي ضعف الذاكرة على تنظيم حياتهم اليومية",
      icon: "🎯",
    },
    {
      label: "المسابقة",
      value: "مسابقة إبداع 2026 - فئة التطبيقات الذكية",
      icon: "🏆",
    },
    {
      label: "تاريخ الإطلاق",
      value: "أكتوبر 2025",
      icon: "📅",
    },
    {
      label: "الإصدار",
      value: "1.0.0 (Beta)",
      icon: "🔖",
    },
  ];

  const features = [
    {
      title: "تسجيل آمن",
      description: "تسجيل ملاحظات صوتية وصور ونصوص بشكل آمن ومشفر",
      icon: <Heart className="w-6 h-6 text-red-500" />,
    },
    {
      title: "ذكاء اصطناعي",
      description: "تصنيف تلقائي للملاحظات وتوليد ملخصات ذكية",
      icon: <Award className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "تذكيرات ذكية",
      description: "نظام تذكيرات سياقية وموقوتة حسب احتياجات المستخدم",
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">عن ذِكر — SmartMem</h1>
          <p className="text-xl text-gray-600">
            نظام ذكي لمساعدة كبار السن وذوي ضعف الذاكرة على تنظيم حياتهم اليومية
          </p>
        </div>

        {/* Project Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>معلومات المشروع</CardTitle>
            <CardDescription>تفاصيل شاملة عن المشروع والغرض منه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectInfo.map((info, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600 font-medium">{info.label}</p>
                  <p className="text-lg text-gray-900 font-semibold mt-1">{info.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Creator Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>معلومات المطور</CardTitle>
            <CardDescription>تفاصيل التواصل والمعلومات الشخصية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">الاسم</p>
                  <p className="text-lg font-semibold text-gray-900">{creatorInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                  <a
                    href={`mailto:${creatorInfo.email}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {creatorInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">رقم الجوال</p>
                  <a
                    href={`tel:${creatorInfo.phone}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {creatorInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">المؤسسة / المدرسة</p>
                  <p className="text-lg font-semibold text-gray-900">{creatorInfo.organization}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">الموقع الإلكتروني</p>
                  <p className="text-lg font-semibold text-gray-900">{creatorInfo.website}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">المسابقة</p>
                  <p className="text-lg font-semibold text-gray-900">{creatorInfo.purpose}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rights & Credits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>الحقوق والرخصة</CardTitle>
            <CardDescription>معلومات الملكية والاستخدام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">جميع الحقوق محفوظة</h4>
              <p className="text-gray-600">
                © 2025 SmartMem. جميع الحقوق محفوظة. لا يجوز نسخ أو توزيع أو تعديل هذا المشروع بدون إذن كتابي من المطور.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">التقنيات المستخدمة</h4>
              <p className="text-gray-600">
                React 19 • TypeScript • Tailwind CSS • tRPC • MySQL • Express.js • Vite
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">الأمان والخصوصية</h4>
              <p className="text-gray-600">
                جميع البيانات مشفرة بتشفير AES-256. لا نشارك بيانات المستخدمين مع أطراف ثالثة. اقرأ سياسة الخصوصية الكاملة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">للتواصل معنا</CardTitle>
            <CardDescription className="text-blue-100">
              لديك أسئلة أو اقتراحات؟ نحن هنا للمساعدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => window.location.href = `mailto:${creatorInfo.email}`}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Mail className="w-4 h-4 mr-2" />
                أرسل بريداً إلكترونياً
              </Button>
              <Button
                onClick={() => window.location.href = `tel:${creatorInfo.phone}`}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Phone className="w-4 h-4 mr-2" />
                اتصل بنا
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}

