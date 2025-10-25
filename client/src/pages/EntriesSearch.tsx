import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Search, Filter, Calendar, Tag, Mic, Camera, FileText } from "lucide-react";

export default function EntriesSearch() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const LABELS = [
    { id: "medicine", name: "دواء", color: "bg-red-100 text-red-800" },
    { id: "appointment", name: "موعد", color: "bg-blue-100 text-blue-800" },
    { id: "family", name: "عائلة", color: "bg-purple-100 text-purple-800" },
    { id: "food", name: "طعام", color: "bg-green-100 text-green-800" },
    { id: "outing", name: "خروج", color: "bg-yellow-100 text-yellow-800" },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      // TODO: Search via API
      // const response = await api.entries.search.query({
      //   query: searchQuery,
      //   labels: selectedLabels,
      //   dateStart: dateRange.start,
      //   dateEnd: dateRange.end,
      // });
      // setEntries(response.entries);
      console.log("Searching for:", { searchQuery, selectedLabels, dateRange });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-4 h-4 text-blue-600" />;
      case "image":
        return <Camera className="w-4 h-4 text-green-600" />;
      case "text":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="mb-4"
          >
            ← العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">البحث في الملاحظات</h1>
          <p className="text-gray-600 mt-2">ابحث عن ملاحظاتك السابقة</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              معايير البحث
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                البحث عن نص
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن كلمات أو عبارات..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Labels Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                التصنيفات
              </label>
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
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  من التاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  إلى التاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "جاري البحث..." : "بحث"}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {entries.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              تم العثور على {entries.length} نتيجة
            </div>
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getEntryIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString("ar-SA")}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString("ar-SA")}
                        </span>
                      </div>
                      {entry.transcript && (
                        <p className="text-gray-700 mb-3">{entry.transcript}</p>
                      )}
                      {entry.labels && entry.labels.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {entry.labels.map((label: string) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate(`/entry/${entry.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      عرض
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لم يتم العثور على نتائج</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

