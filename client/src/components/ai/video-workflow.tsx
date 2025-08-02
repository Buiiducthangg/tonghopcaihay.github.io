import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Video, Download } from "lucide-react";

export default function VideoWorkflow() {
  const steps = [
    {
      icon: Search,
      title: "1. Phân tích sản phẩm",
      description: "AI phân tích thông tin sản phẩm, hình ảnh và đặc điểm để tạo kịch bản phù hợp",
      color: "tiktok-bg-red",
    },
    {
      icon: FileText,
      title: "2. Tạo kịch bản",
      description: "Tự động tạo nội dung video với hashtag xu hướng và mô tả hấp dẫn",
      color: "tiktok-bg-cyan",
    },
    {
      icon: Video,
      title: "3. Xuất video",
      description: "Tạo video chất lượng cao với link bán hàng TikTok tự động",
      color: "tiktok-bg-pink",
    },
  ];

  return (
    <Card className="shadow-sm border border-gray-200 mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-2 flex items-center justify-center">
            <Video className="text-white" size={14} />
          </div>
          Quy trình tạo video AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${step.color} text-white mb-4`}>
                <step.icon size={24} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* AI Video Generation Demo */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Demo tạo video AI</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Input sản phẩm</h5>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
                    alt="Selected product"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Áo thun unisex cao cấp</p>
                    <p className="text-xs text-gray-500">199,000 VNĐ</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Đặc điểm:</strong> Cotton 100%, form rộng, màu sắc đa dạng</p>
                  <p><strong>Target:</strong> Gen Z, unisex fashion</p>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Output AI</h5>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="text-xs text-gray-600 space-y-2">
                  <p><strong>Kịch bản:</strong> "Check out áo thun unisex này! Cotton 100% siêu mềm mại, form rộng trendy..."</p>
                  <p><strong>Hashtags:</strong> #fyp #fashion #unisex #cotton #trendy #vietnam #xuhuong</p>
                  <p><strong>Hook:</strong> "POV: Bạn tìm được chiếc áo thun hoàn hảo ✨"</p>
                  <p><strong>Call-to-action:</strong> "Link mua ngay trong bio! 👆"</p>
                </div>
                <Button className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs hover:opacity-90">
                  <Download className="mr-1" size={12} />
                  Tải video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
