
import { PowerCalculator } from "@/components/PowerCalculator";
import { PowerInformation } from "@/components/PowerInformation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-6 border-b bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a href="https://www.socr.umich.edu/" target="_blank" rel="noopener noreferrer">
              <img 
                src="/lovable-uploads/c6be3194-4426-4230-b57a-13b9e4cf0b6f.png" 
                alt="SOCR Logo" 
                className="h-16"
              />
            </a>
          </div>
          <h1 className="text-3xl font-bold text-center text-blue-800">SOCR Statistical Power Analyzer</h1>
          <p className="text-center text-gray-600 mt-2">
            A tool by <a href="https://www.socr.umich.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SOCR</a> for calculating statistical power, sample size, effect size, and significance level
          </p>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline"
              onClick={() => setShowInfo(!showInfo)}
              className="bg-blue-50 hover:bg-blue-100"
            >
              {showInfo ? "Hide Information" : "Show Information About Power Analysis"}
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8">
        {showInfo && <PowerInformation />}
        <PowerCalculator />
      </main>
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2025 <a href="https://www.socr.umich.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SOCR</a> (Statistics Online Computational Resource)</p>
          <p className="text-sm mt-2">This tool provides statistical power analysis for research design.</p>
          <div className="mt-4 text-xs">
            <p>Based on established statistical methods and Cohen's effect size conventions.</p>
            <p>For research purposes only. Always consult with a statistician for complex study designs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
