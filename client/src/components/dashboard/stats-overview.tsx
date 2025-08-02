import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Video, Eye, DollarSign } from "lucide-react";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      name: "Tổng sản phẩm",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-red-500",
    },
    {
      name: "Video đã tạo",
      value: stats?.videosCreated || 0,
      icon: Video,
      color: "tiktok-text-cyan",
    },
    {
      name: "Lượt xem",
      value: stats?.totalViews || "0",
      icon: Eye,
      color: "text-green-500",
    },
    {
      name: "Doanh thu",
      value: stats?.revenue || "$0",
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {statItems.map((item) => (
        <Card key={item.name} className="overflow-hidden shadow-sm border border-gray-200">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className={`text-2xl ${item.color}`} size={28} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
