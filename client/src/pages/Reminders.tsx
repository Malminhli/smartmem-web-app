import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Trash2, Edit2, Clock, ToggleRight, ToggleLeft } from "lucide-react";

export default function Reminders() {
  const [, navigate] = useLocation();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from API
      // const response = await api.reminders.list.query();
      // setReminders(response.reminders);
    } catch (error) {
      console.error("Failed to load reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (id: string) => {
    try {
      // TODO: Toggle via API
      // await api.reminders.toggle.mutate({ id });
      loadReminders();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm("هل تريد حذف هذا التذكير؟")) return;
    try {
      // TODO: Delete via API
      // await api.reminders.delete.mutate({ id });
      loadReminders();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="mb-4"
            >
              ← العودة
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">التذكيرات</h1>
            <p className="text-gray-600 mt-2">إدارة التذكيرات اليومية والدورية</p>
          </div>
          <Button onClick={() => alert("سيتم إضافة نموذج إنشاء تذكير قريباً")} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            تذكير جديد
          </Button>
        </div>

        {/* Reminders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل التذكيرات...</p>
            </div>
          </div>
        ) : reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((reminder: any) => (
              <Card key={reminder.id} className={reminder.isActive ? "" : "opacity-60"}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                        <Badge variant={reminder.isActive ? "default" : "secondary"}>
                          {reminder.isActive ? "مفعل" : "معطل"}
                        </Badge>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mb-3">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{reminder.scheduleTime}</span>
                        </div>
                        <Badge variant="outline">
                          {reminder.frequency === "daily" && "يومي"}
                          {reminder.frequency === "weekly" && "أسبوعي"}
                          {reminder.frequency === "monthly" && "شهري"}
                          {reminder.frequency === "once" && "مرة واحدة"}
                        </Badge>
                        {reminder.label && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {reminder.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => toggleReminder(reminder.id)}
                        variant="ghost"
                        size="sm"
                      >
                        {reminder.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        onClick={() => alert("سيتم إضافة تحرير التذكير قريباً")}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => deleteReminder(reminder.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">لا توجد تذكيرات مسجلة</p>
              <Button onClick={() => alert("سيتم إضافة نموذج إنشاء تذكير قريباً")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                إنشاء تذكير
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

