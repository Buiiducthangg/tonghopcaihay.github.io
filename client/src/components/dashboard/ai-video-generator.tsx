import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bot, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

const videoStyles = [
  { value: "trendy", label: "Trendy" },
  { value: "professional", label: "Chuyên nghiệp" },
  { value: "fun", label: "Vui nhộn" },
  { value: "simple", label: "Đơn giản" },
];

export default function AIVideoGenerator() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const generateVideoMutation = useMutation({
    mutationFn: async ({ productId, style }: { productId: string; style: string }) => {
      const response = await apiRequest("POST", "/api/videos/generate", { productId, style });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Video AI đã được tạo!",
        description: `Video "${data.title}" đã được tạo thành công với ${data.hashtags?.length || 0} hashtag trending.`,
      });
      setSelectedProduct("");
      setSelectedStyle("");
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo video AI. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!selectedProduct || !selectedStyle) {
      toast({
        title: "Vui lòng chọn đầy đủ thông tin",
        description: "Hãy chọn sản phẩm và phong cách video.",
        variant: "destructive",
      });
      return;
    }

    generateVideoMutation.mutate({
      productId: selectedProduct,
      style: selectedStyle,
    });
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <Bot className="tiktok-text-cyan mr-2" size={20} />
          Tạo video AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn sản phẩm</label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn sản phẩm..." />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phong cách video</label>
          <div className="grid grid-cols-2 gap-2">
            {videoStyles.map((style) => (
              <Button
                key={style.value}
                variant={selectedStyle === style.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style.value)}
                className={selectedStyle === style.value ? "tiktok-bg-cyan text-white" : ""}
              >
                {style.label}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateVideoMutation.isPending}
          className="w-full tiktok-bg-cyan hover:opacity-90 text-white"
        >
          {generateVideoMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tạo video...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" size={16} />
              Tạo video AI
            </>
          )}
        </Button>

        {/* AI Status */}
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center">
            <Bot className="text-blue-500 mr-2" size={16} />
            <p className="text-sm text-blue-700">
              {generateVideoMutation.isPending 
                ? "AI đang phân tích sản phẩm và tạo video..."
                : "AI sẵn sàng phân tích sản phẩm và xu hướng"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
