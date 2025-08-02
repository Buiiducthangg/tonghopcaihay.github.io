import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200 lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="px-4 border-r border-gray-200 text-gray-500"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </Button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">TikCreator AI</h1>
        <Button variant="ghost" size="sm" className="tiktok-bg-red text-white p-2 rounded-full">
          <Bell size={16} />
        </Button>
      </div>
    </div>
  );
}
