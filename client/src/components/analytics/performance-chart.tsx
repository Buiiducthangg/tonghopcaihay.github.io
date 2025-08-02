import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart() {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <TrendingUp className="text-green-500 mr-2" size={20} />
          Hiệu suất video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="mx-auto text-4xl text-gray-400 mb-2" size={48} />
            <p className="text-sm text-gray-500">Biểu đồ hiệu suất video</p>
            <p className="text-xs text-gray-400 mt-1">Sẽ hiển thị thống kê chi tiết về hiệu suất video</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
