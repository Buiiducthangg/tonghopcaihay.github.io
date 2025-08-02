import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Eye } from "lucide-react";
import VideoPreviewModal from "@/components/video/video-preview-modal";
import type { Video } from "@shared/schema";

const getStatusBadge = (views: number) => {
  if (views >= 2000) return { label: "Viral", variant: "default" as const, className: "bg-green-100 text-green-800" };
  if (views >= 1000) return { label: "Trending", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" };
  if (views >= 500) return { label: "Rising", variant: "outline" as const, className: "bg-blue-100 text-blue-800" };
  return { label: "New", variant: "outline" as const, className: "bg-gray-100 text-gray-800" };
};

const getTimeAgo = (date: Date | string) => {
  const now = new Date();
  const videoDate = new Date(date);
  const diffInHours = Math.floor((now.getTime() - videoDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Vừa xong";
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

export default function RecentVideos() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/analytics/recent-videos"],
  });

  const handleViewVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium text-gray-900">
            <PlayCircle className="tiktok-text-cyan mr-2" size={20} />
            Video gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-16 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
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
          <PlayCircle className="tiktok-text-cyan mr-2" size={20} />
          Video gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos && videos.length > 0 ? (
            videos.map((video) => {
              const status = getStatusBadge(video.views || 0);
              return (
                <div key={video.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded flex items-center justify-center">
                      <PlayCircle className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                    <p className="text-xs text-gray-500">
                      {(video.views || 0).toLocaleString()} views • {getTimeAgo(video.createdAt || new Date())}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <Badge variant={status.variant} className={status.className}>
                      {status.label}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVideo(video)}
                      className="tiktok-text-pink hover:bg-pink-50"
                    >
                      <Eye size={14} className="mr-1" />
                      Xem lại
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <PlayCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">Chưa có video nào được tạo</p>
            </div>
          )}
        </div>

        <VideoPreviewModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </CardContent>
    </Card>
  );
}
