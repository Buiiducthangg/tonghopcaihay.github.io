import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, TrendingUp } from "lucide-react";
import type { Hashtag } from "@shared/schema";

const getViewsDisplay = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${Math.floor(views / 1000)}K`;
  }
  return views.toString();
};

const getEmoji = (trending: number, category: string) => {
  if (trending >= 95) return "🔥";
  if (trending >= 85) return "📈";
  if (trending >= 75) return "⚡";
  if (category === "vietnam") return "🇻🇳";
  return "🚀";
};

export default function TrendingHashtags() {
  const { data: hashtags, isLoading } = useQuery<Hashtag[]>({
    queryKey: ["/api/hashtags/trending"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium text-gray-900">
            <Hash className="tiktok-text-pink mr-2" size={20} />
            Hashtag xu hướng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <Hash className="tiktok-text-pink mr-2" size={20} />
          Hashtag xu hướng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hashtags?.slice(0, 5).map((hashtag) => (
            <div key={hashtag.id} className="flex items-center justify-between">
              <span className="text-sm font-medium tiktok-text-red">
                {hashtag.tag}
              </span>
              <span className="text-xs text-gray-500">
                {getEmoji(hashtag.trending, hashtag.category || "")} {getViewsDisplay(hashtag.views)}
              </span>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          className="mt-4 w-full border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
        >
          <TrendingUp className="mr-2" size={16} />
          Xem thêm hashtag
        </Button>
      </CardContent>
    </Card>
  );
}
