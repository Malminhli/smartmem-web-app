import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Trash2, Edit2, Phone, Mail, Users } from "lucide-react";

export default function Contacts() {
  const [, navigate] = useLocation();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from API
      // const response = await api.contacts.list.query();
      // setContacts(response.contacts);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الاتصال؟")) return;
    try {
      // TODO: Delete via API
      // await api.contacts.delete.mutate({ id });
      loadContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      caregiver: "مقدم رعاية",
      family: "عائلة",
      doctor: "طبيب",
      emergency: "طوارئ",
    };
    return labels[role] || role;
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
            <h1 className="text-3xl font-bold text-gray-900">جهات الاتصال الموثوقة</h1>
            <p className="text-gray-600 mt-2">إدارة جهات الاتصال والمشرفين</p>
          </div>
          <Button onClick={() => alert("سيتم إضافة نموذج إضافة جهة اتصال قريباً")} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            إضافة جهة اتصال
          </Button>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل جهات الاتصال...</p>
            </div>
          </div>
        ) : contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {getRoleLabel(contact.role)}
                        </Badge>
                      </div>
                      <div className="space-y-2 mt-3">
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {contact.canViewData && (
                          <Badge variant="outline" className="text-xs">
                            يمكنه عرض البيانات
                          </Badge>
                        )}
                        {contact.canEditReminders && (
                          <Badge variant="outline" className="text-xs">
                            يمكنه تعديل التذكيرات
                          </Badge>
                        )}
                        {contact.canReceiveAlerts && (
                          <Badge variant="outline" className="text-xs">
                            يستقبل التنبيهات
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => alert("سيتم إضافة تحرير جهة الاتصال قريباً")}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => deleteContact(contact.id)}
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
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">لا توجد جهات اتصال مسجلة</p>
              <Button onClick={() => alert("سيتم إضافة نموذج إضافة جهة اتصال قريباً")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                إضافة جهة اتصال
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

