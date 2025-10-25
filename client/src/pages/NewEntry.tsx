import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Mic, Camera, FileText, Send, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LABELS = [
  { id: "medicine", name: "دواء", color: "bg-red-100 text-red-800" },
  { id: "appointment", name: "موعد", color: "bg-blue-100 text-blue-800" },
  { id: "family", name: "عائلة", color: "bg-purple-100 text-purple-800" },
  { id: "food", name: "طعام", color: "bg-green-100 text-green-800" },
  { id: "outing", name: "خروج", color: "bg-yellow-100 text-yellow-800" },
  { id: "general", name: "عام", color: "bg-gray-100 text-gray-800" },
];

export default function NewEntry() {
  const [, navigate] = useLocation();
  const [entryType, setEntryType] = useState<"audio" | "image" | "text">("text");
  const [transcript, setTranscript] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // Convert blob to base64 for transmission
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          setTranscript(base64);
          toast.success("تم تسجيل الصوت بنجاح!");
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("فشل بدء التسجيل. تأكد من السماح بالوصول للميكروفون.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setTranscript(base64);
        toast.success("تم اختيار الصورة بنجاح!");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const createEntryMutation = trpc.entries.create.useMutation();

  const handleSubmit = async () => {
    if (!transcript && entryType === "text") {
      toast.error("يرجى إدخال ملاحظة");
      return;
    }

    try {
      setLoading(true);
      await createEntryMutation.mutateAsync({
        type: entryType,
        transcript: transcript || "",
        labels: selectedLabels,
      });
      toast.success("تم حفظ الملاحظة بنجاح!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create entry:", error);
      toast.error("فشل حفظ الملاحظة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">ملاحظة جديدة</h1>
          <p className="text-gray-600 mt-2">أضف ملاحظة جديدة لمساعدتك على تنظيم يومك</p>
        </div>

        {/* Entry Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>نوع الملاحظة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: "audio" as const, icon: Mic, label: "صوتي" },
                { type: "image" as const, icon: Camera, label: "صورة" },
                { type: "text" as const, icon: FileText, label: "نصي" },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.type}
                    onClick={() => setEntryType(option.type)}
                    variant={entryType === option.type ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Icon className="w-6 h-6" />
                    <span>{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Entry Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {entryType === "audio" && "تسجيل صوتي"}
              {entryType === "image" && "التقاط صورة"}
              {entryType === "text" && "ملاحظة نصية"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entryType === "audio" && (
              <div className="space-y-4">
                <Button
                  onClick={isRecording ? stopAudioRecording : startAudioRecording}
                  className={`w-full h-16 text-lg ${
                    isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Mic className="w-6 h-6 mr-2" />
                  {isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
                </Button>
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-red-50 rounded">
                    <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-red-600 font-medium">جاري التسجيل...</span>
                  </div>
                )}
              </div>
            )}

            {entryType === "image" && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  التقاط صورة
                </Button>
              </div>
            )}

            {entryType === "text" && (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="اكتب ملاحظتك هنا..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            )}
          </CardContent>
        </Card>

        {/* Labels Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>التصنيفات</CardTitle>
            <CardDescription>اختر التصنيفات المناسبة لهذه الملاحظة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {LABELS.map((label) => (
                <Badge
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  className={`cursor-pointer px-4 py-2 transition-all ${
                    selectedLabels.includes(label.id)
                      ? label.color
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex-1 h-12"
          >
            <X className="w-4 h-4 mr-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || createEntryMutation.isPending}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading || createEntryMutation.isPending ? "جاري الحفظ..." : "حفظ الملاحظة"}
          </Button>
        </div>
      </div>
    </div>
  );
}

