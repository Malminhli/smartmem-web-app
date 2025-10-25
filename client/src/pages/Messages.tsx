import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Mail, Trash2, Check, AlertCircle, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Messages() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: messagesData, isLoading: messagesLoading, refetch } = trpc.messages.list.useQuery({
    limit: 50,
    offset: 0,
    unreadOnly: false,
  });

  const { data: unreadData } = trpc.messages.getUnreadCount.useQuery();
  const markAsReadMutation = trpc.messages.markAsRead.useMutation();
  const deleteMutation = trpc.messages.delete.useMutation();

  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
    setLoading(messagesLoading);
  }, [messagesData, messagesLoading]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsReadMutation.mutateAsync({ messageId });
      toast.success("تم تعليم الرسالة كمقروءة");
      refetch();
    } catch (error) {
      toast.error("فشل تعليم الرسالة");
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMutation.mutateAsync({ messageId });
      toast.success("تم حذف الرسالة");
      refetch();
    } catch (error) {
      toast.error("فشل حذف الرسالة");
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Bell className="w-5 h-5 text-blue-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "notification":
        return <Mail className="w-5 h-5 text-green-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMessageTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      reminder: { label: "تذكير", color: "bg-blue-100 text-blue-800" },
      alert: { label: "تنبيه", color: "bg-red-100 text-red-800" },
      notification: { label: "إشعار", color: "bg-green-100 text-green-800" },
      contact: { label: "اتصال", color: "bg-purple-100 text-purple-800" },
      system: { label: "نظام", color: "bg-gray-100 text-gray-800" },
    };
    const info = typeMap[type] || typeMap.notification;
    return <Badge className={info.color}>{info.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">الرسائل والإشعارات</h1>
              <p className="text-gray-600 mt-2">إدارة رسائلك وإشعاراتك الآمنة المشفرة</p>
            </div>
            {unreadData && unreadData.unreadCount > 0 && (
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                {unreadData.unreadCount}
              </div>
            )}
          </div>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>الرسائل الخاصة بك</CardTitle>
            <CardDescription>
              جميع رسائلك محفوظة بشكل آمن ومشفرة تماماً
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center py-8">جاري التحميل...</p>
            ) : messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                      message.isRead
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-300"
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getMessageIcon(message.messageType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {message.subject && (
                            <h3 className="font-semibold text-gray-900 truncate">
                              {message.subject}
                            </h3>
                          )}
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        {getMessageTypeBadge(message.messageType)}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <span>
                          {new Date(message.createdAt).toLocaleString("ar-SA")}
                        </span>
                        {message.isRead && message.readAt && (
                          <span>
                            • مقروءة في{" "}
                            {new Date(message.readAt).toLocaleTimeString("ar-SA")}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        {!message.isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(message.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            تعليم كمقروءة
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(message.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد رسائل حالياً</p>
                <p className="text-gray-400 text-sm mt-1">
                  ستظهر الرسائل والإشعارات هنا
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <Check className="w-5 h-5" />
              أمان الرسائل
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-800">
            <ul className="space-y-2 text-sm">
              <li>✅ جميع الرسائل مشفرة بتشفير AES-256</li>
              <li>✅ لا يمكن لأحد الوصول إلى محتوى رسائلك</li>
              <li>✅ يتم حفظ الرسائل بشكل آمن في قاعدة البيانات</li>
              <li>✅ يمكنك حذف الرسائل في أي وقت</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

