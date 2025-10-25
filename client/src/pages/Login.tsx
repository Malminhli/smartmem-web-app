import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("فشل تسجيل الدخول");
      }

      // إعادة التوجيه إلى لوحة التحكم
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || email }),
      });

      if (!response.ok) {
        throw new Error("فشل تسجيل الدخول");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ذِكر</h1>
          <p className="text-gray-600">SmartMem - نظام ذكي لتنظيم ذاكرتك</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Demo Login Button */}
          <Button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 mb-6"
          >
            {loading ? "جاري تسجيل الدخول..." : "جرب النسخة التجريبية"}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">أو</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-900">
              💡 <strong>نصيحة:</strong> استخدم النسخة التجريبية لاستكشاف جميع الميزات بدون الحاجة لإنشاء حساب
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← العودة
          </button>
        </div>
      </div>
    </div>
  );
}

