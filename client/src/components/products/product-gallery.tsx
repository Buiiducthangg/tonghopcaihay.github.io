import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductCard from "./product-card";
import type { Product } from "@shared/schema";

export default function ProductGallery() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">Sản phẩm của tôi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2 mt-3">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Sản phẩm của tôi</CardTitle>
          <Button className="tiktok-bg-red hover:bg-pink-600 text-white">
            <Plus className="mr-2" size={16} />
            Thêm sản phẩm
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
