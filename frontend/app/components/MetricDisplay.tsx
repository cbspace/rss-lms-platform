// components/MetricDisplay.tsx      
export interface MetricDisplayProps {
  heading: string;
  value?: string;
}

export default function MetricDisplay({
  heading,
  value="",
}: MetricDisplayProps) {
  return (       
  <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500">
    <div className="text-[12px] font-mono opacity-80 uppercase tracking-wider">{heading}</div>
    <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
      {value}
    </div>
  </div>
  );
}