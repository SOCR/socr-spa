
import React from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface ChartFullscreenButtonProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export function ChartFullscreenButton({ 
  isFullScreen, 
  toggleFullScreen 
}: ChartFullscreenButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleFullScreen}
      className="bg-white hover:bg-gray-100 z-10"
    >
      {isFullScreen ? <Minimize2 className="h-4 w-4 mr-1" /> : <Maximize2 className="h-4 w-4 mr-1" />}
      {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
    </Button>
  );
}
