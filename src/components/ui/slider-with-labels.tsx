import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SliderLabel {
  value: number;
  label: string;
  highlight?: boolean;
}

interface SliderWithLabelsProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  labels?: SliderLabel[];
  showCurrentValue?: boolean;
  formatValue?: (value: number) => string;
  currentValueSuffix?: string;
}

const SliderWithLabels = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderWithLabelsProps
>(({ className, labels = [], showCurrentValue = true, formatValue, currentValueSuffix = "", min = 0, max = 100, value, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  
  const currentValue = value?.[0] ?? 0;
  
  const calculatePosition = (val: number): number => {
    const numMin = Number(min);
    const numMax = Number(max);
    return ((val - numMin) / (numMax - numMin)) * 100;
  };

  const displayValue = formatValue ? formatValue(currentValue) : currentValue.toFixed(3);
  const showTooltip = showCurrentValue && (isHovered || isDragging);

  return (
    <div className="relative w-full">
      <TooltipProvider delayDuration={0}>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
            >
              <SliderPrimitive.Root
                ref={ref}
                min={min}
                max={max}
                value={value}
                className={cn(
                  "relative flex w-full touch-none select-none items-center py-4",
                  className
                )}
                {...props}
              >
                <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary">
                  <SliderPrimitive.Range className="absolute h-full bg-primary" />
                </SliderPrimitive.Track>
                
                {/* Tick marks at label positions */}
                {labels.map((label, idx) => {
                  const position = calculatePosition(label.value);
                  return (
                    <div
                      key={idx}
                      className="absolute h-3 w-0.5 bg-border"
                      style={{ left: `${position}%`, top: '50%', transform: 'translateY(-50%)' }}
                    />
                  );
                })}
                
                <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110" />
              </SliderPrimitive.Root>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-primary text-primary-foreground font-semibold">
            {displayValue}{currentValueSuffix}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Proportionally positioned labels with overlap prevention */}
      {labels.length > 0 && (
        <div className="relative w-full mt-2" style={{ height: '3rem' }}>
          {labels.map((label, idx) => {
            const position = calculatePosition(label.value);
            
            // Check for overlap with previous label (positions within 18% are considered overlapping)
            let isStaggered = false;
            if (idx > 0) {
              const prevPosition = calculatePosition(labels[idx - 1].value);
              if (Math.abs(position - prevPosition) < 18) {
                isStaggered = true;
              }
            }
            
            return (
              <div
                key={idx}
                className={cn(
                  "absolute text-xs whitespace-nowrap transition-all",
                  label.highlight ? "text-foreground font-medium" : "text-muted-foreground"
                )}
                style={{
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  top: isStaggered ? '1.25rem' : '0',
                }}
              >
                {label.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

SliderWithLabels.displayName = "SliderWithLabels";

export { SliderWithLabels };
export type { SliderLabel };
