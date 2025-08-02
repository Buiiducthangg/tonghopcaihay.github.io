import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, PlusCircle, Search, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function QuickProductAdd() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeTikTokMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/tiktok/analyze", { url });
      return response.json();
    },
    onSuccess: (data) => {
      setName(data.productName || "");
      setPrice(data.estimatedPrice || "");
      setDescription(data.description || "");
      toast({
        title: "Phân tích TikTok thành công!",
        description: `Đã trích xuất thông tin sản phẩm từ video TikTok.`,
      });
    },
    onError: () => {
      toast({
        title: "Lỗi phân tích",
        description: "Không thể phân tích video TikTok. Vui lòng kiểm tra URL.",
        variant: "destructive",
      });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/products", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được thêm thành công!",
      });
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setTiktokUrl("");
    },
    onError: (error: any) => {
      console.error("Product creation error:", error);
      let errorMessage = "Không thể thêm sản phẩm. Vui lòng thử lại.";
      
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message.split(': ').slice(1).join(': '));
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].message || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Keep default error message
        }
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên sản phẩm và giá bán.",
        variant: "destructive",
      });
      return;
    }

    // Convert price to number
    const priceNumber = parseInt(price.replace(/[^\d]/g, "")) || 0;
    if (priceNumber <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá bán hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", priceNumber.toString());
    formData.append("description", description.trim());
    formData.append("category", "general");
    
    if (image) {
      formData.append("image", image);
    }

    addProductMutation.mutate(formData);
  };

  const handleAnalyzeTikTok = () => {
    if (!tiktokUrl.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL TikTok để phân tích.",
        variant: "destructive",
      });
      return;
    }
    analyzeTikTokMutation.mutate(tiktokUrl);
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <PlusCircle className="tiktok-text-red mr-2" size={20} />
          Thêm sản phẩm nhanh
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TikTok Analysis Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <ExternalLink className="text-pink-600 mr-2" size={16} />
            Phân tích sản phẩm từ TikTok
          </h4>
          <div className="flex gap-2">
            <Input
              type="url"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAnalyzeTikTok}
              disabled={analyzeTikTokMutation.isPending}
              className="tiktok-bg-pink hover:bg-pink-600 text-white"
            >
              <Search size={16} className="mr-1" />
              {analyzeTikTokMutation.isPending ? "Đang phân tích..." : "Phân tích"}
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Paste link TikTok để AI tự động phân tích và điền thông tin sản phẩm
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên sản phẩm
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Giá bán
            </Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="199,000 VNĐ"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả sản phẩm
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về sản phẩm..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700">Ảnh sản phẩm</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium tiktok-text-red hover:text-pink-500">
                    <span>Tải ảnh lên</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {image && (
                  <p className="text-xs text-gray-500">{image.name}</p>
                )}
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={addProductMutation.isPending}
            className="w-full tiktok-bg-red hover:bg-pink-600 text-white"
          >
            {addProductMutation.isPending ? "Đang thêm..." : "Thêm sản phẩm"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
