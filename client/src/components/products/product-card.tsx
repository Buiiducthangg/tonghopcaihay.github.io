import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Video, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateVideoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/videos/generate", {
        productId: product.id,
        style: "trendy"
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Video AI đã được tạo!",
        description: `Video cho "${product.name}" đã được tạo thành công.`,
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo video. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("vi-VN") + " VNĐ";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-400">Không có ảnh</span>
        </div>
      )}
      
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
          {product.name}
        </h4>
        <p className="text-sm text-gray-500 mb-3">
          {formatPrice(product.price)}
        </p>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => generateVideoMutation.mutate()}
            disabled={generateVideoMutation.isPending}
            className="flex-1 tiktok-bg-red hover:bg-pink-600 text-white text-xs"
          >
            {generateVideoMutation.isPending ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
            ) : (
              <Video className="mr-1" size={12} />
            )}
            {generateVideoMutation.isPending ? "Đang tạo..." : "Tạo video"}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="text-gray-700 hover:bg-gray-50"
          >
            <Edit size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
