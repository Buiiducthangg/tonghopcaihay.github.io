import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Video, 
  Package, 
  Bot, 
  Hash, 
  BarChart3, 
  Link as LinkIcon,
  LayoutDashboard
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "/products", icon: Package },
  { name: "AI Video Generator", href: "/ai-video", icon: Bot },
  { name: "Hashtag Trending", href: "/hashtags", icon: Hash },
  { name: "Phân tích", href: "/analytics", icon: BarChart3 },
  { name: "TikTok Links", href: "/links", icon: LinkIcon },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 tiktok-gradient">
          <Video className="text-white text-2xl mr-3" size={28} />
          <h1 className="text-white font-bold text-xl font-sans">TikCreator AI</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "tiktok-bg-red text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3" size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="flex-shrink-0 flex bg-gray-50 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <img 
                  className="inline-block h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                  alt="User profile" 
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Nguyễn Creator</p>
                <p className="text-xs font-medium text-gray-500">Creator Pro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
