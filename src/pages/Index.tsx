import { PowerCalculator } from "@/components/PowerCalculator";
import { PowerInformation } from "@/components/PowerInformation";
import { PowerAnalysisGuideSimple } from "@/components/documentation/PowerAnalysisGuideSimple";
import { PowerAnalysisComprehensiveGuide } from "@/components/documentation/PowerAnalysisComprehensiveGuide";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-6 border-b bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a href="https://www.socr.umich.edu/" target="_blank" rel="noopener noreferrer">
              <img src="/lovable-uploads/c6be3194-4426-4230-b57a-13b9e4cf0b6f.png" alt="SOCR Logo" className="h-16" />
            </a>
          </div>
          <h1 className="text-3xl font-bold text-center text-blue-800">SOCR Statistical Power Analyzer</h1>
          <p className="text-center text-gray-600 mt-2">
            A tool by{" "}
            <a
              href="https://www.socr.umich.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              SOCR
            </a>{" "}
            for calculating statistical power, sample size, effect size, and significance level
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowInfo(!showInfo)} className="bg-blue-50 hover:bg-blue-100">
              {showInfo ? "Hide Basic Info" : "Show Basic Info"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowGuide(!showGuide)}
              className="bg-green-50 hover:bg-green-100"
            >
              {showGuide ? "Hide Comprehensive Guide" : "Show Comprehensive Guide"}
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8">
        <ErrorBoundary fallbackMessage="Error loading application components. Please refresh the page.">
          {showInfo && <PowerInformation />}
          <PowerCalculator />
          {showGuide && <PowerAnalysisComprehensiveGuide />}
        </ErrorBoundary>
      </main>
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto text-center text-gray-500">
          <p>
            © 2025{" "}
            <a
              href="https://www.socr.umich.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              SOCR
            </a>{" "}
            (Statistics Online Computational Resource)
          </p>
          <p className="text-sm mt-2">This tool provides statistical power analysis for research design.</p>
          <div className="mt-4 text-xs">
            <p>
              Based on established statistical methods and Cohen's effect size conventions. For research purposes only.
              Powered by{" "}
              <a
                href="https://socr.umich.edu/GAIM/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                SOCR GAIM
              </a>
              .
            </p>
            <p>
              Always consult with a statistician for complex study designs. Also, see the{" "}
              <a
                href="https://sda.statisticalcomputing.org/AIConsultant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                SOCR AI (Bio)Statistical Consultant
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
