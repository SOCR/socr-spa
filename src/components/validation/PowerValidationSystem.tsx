import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PowerParameters } from "@/types/power-analysis";
import { EFFECT_SIZE_MAP } from "@/utils/powerAnalysis";
import { AlertTriangle, CheckCircle, Info, BookOpen } from "lucide-react";

interface PowerValidationSystemProps {
  params: PowerParameters;
  calculatedValue: number | null;
  targetParameter: string;
}

export function PowerValidationSystem({ params, calculatedValue, targetParameter }: PowerValidationSystemProps) {
  // Comprehensive validation rules
  const validateConfiguration = () => {
    const issues: Array<{
      type: 'error' | 'warning' | 'info';
      message: string;
      recommendation?: string;
    }> = [];

    // Check for parameter combinations that may be problematic
    if (params.power && params.power > 0.95 && params.sampleSize && params.sampleSize < 50) {
      issues.push({
        type: 'warning',
        message: 'Very high power with small sample size may detect trivial effects',
        recommendation: 'Consider if such small differences are practically meaningful'
      });
    }

    if (params.effectSize && params.significanceLevel && params.effectSize < 0.1 && params.significanceLevel > 0.05) {
      issues.push({
        type: 'warning',
        message: 'Small effect size with lenient significance level increases false positive risk',
        recommendation: 'Consider using a more conservative alpha level (e.g., 0.01)'
      });
    }

    if (params.sampleSize && params.sampleSize > 1000 && params.effectSize && params.effectSize < 0.2) {
      issues.push({
        type: 'info',
        message: 'Large sample may detect statistically significant but practically trivial effects',
        recommendation: 'Ensure effect size represents meaningful difference in your research context'
      });
    }

    // Test-specific validations
    if (params.test === "ttest-paired" && (!params.correlation || params.correlation < 0)) {
      issues.push({
        type: 'warning',
        message: 'Paired t-test typically assumes positive correlation between measures',
        recommendation: 'Verify correlation assumption or consider independent t-test'
      });
    }

    if ((params.test === "anova" || params.test === "anova-two-way") && params.groups && params.groups > 10) {
      issues.push({
        type: 'warning',
        message: 'Many groups in ANOVA may require multiple comparison corrections',
        recommendation: 'Consider planned contrasts or adjust alpha for multiple comparisons'
      });
    }

    if (params.test === "multiple-regression" && params.predictors && params.sampleSize) {
      const ratio = params.sampleSize / params.predictors;
      if (ratio < 10) {
        issues.push({
          type: 'error',
          message: 'Insufficient sample size for number of predictors',
          recommendation: 'Use at least 10-15 observations per predictor variable'
        });
      } else if (ratio < 15) {
        issues.push({
          type: 'warning',
          message: 'Limited sample size for number of predictors',
          recommendation: 'Consider reducing predictors or increasing sample size'
        });
      }
    }

    return issues;
  };

  const getStatisticalReferences = () => {
    const references = [
      {
        title: "Cohen's Statistical Power Analysis",
        description: "Foundational text on power analysis with effect size conventions",
        citation: "Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.)"
      },
      {
        title: "G*Power Manual", 
        description: "Comprehensive guide to power analysis software and methods",
        citation: "Faul, F., Erdfelder, E., Lang, A.-G., & Buchner, A. (2007). G*Power 3"
      },
      {
        title: "Sample Size Planning",
        description: "Modern approaches to sample size determination",
        citation: "Maxwell, S. E., Kelley, K., & Rausch, J. R. (2008). Psychological Methods, 13(1), 19-35"
      }
    ];

    return references;
  };

  const getInterpretationGuide = () => {
    const guides = {
      "sampleSize": {
        title: "Interpreting Sample Size Results",
        points: [
          "This is the minimum total sample size needed for your study",
          "Add 10-20% buffer for potential participant dropout",
          "Consider practical constraints: recruitment, time, budget",
          "Larger samples provide more precise estimates but may detect trivial effects"
        ]
      },
      "power": {
        title: "Interpreting Power Results", 
        points: [
          "Power = probability of detecting a true effect when it exists",
          "0.80 (80%) is conventional minimum acceptable power",
          "Higher power reduces Type II error (missing true effects)",
          "Very high power (>95%) may detect practically trivial effects"
        ]
      },
      "effectSize": {
        title: "Interpreting Effect Size Results",
        points: [
          "Effect size represents the magnitude of the difference or relationship",
          "Consider both statistical and practical significance",
          "Small effects may be important in large populations",
          "Large effects are easier to detect but may be unrealistic"
        ]
      },
      "significanceLevel": {
        title: "Interpreting Significance Level Results",
        points: [
          "Alpha = probability of Type I error (false positive)",
          "0.05 is conventional but not universal standard",
          "Stricter levels (0.01) reduce false positives but decrease power",
          "Consider consequences of false positives in your research"
        ]
      }
    };

    return guides[targetParameter] || null;
  };

  const issues = validateConfiguration();
  const references = getStatisticalReferences();
  const guide = getInterpretationGuide();

  return (
    <div className="space-y-6">
      {/* Validation Issues */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Configuration Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.map((issue, index) => (
              <Alert key={index} className={
                issue.type === 'error' ? 'border-destructive bg-destructive/5' :
                issue.type === 'warning' ? 'border-amber-500 bg-amber-50' : 
                'border-blue-500 bg-blue-50'
              }>
                {issue.type === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                 issue.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                 <Info className="h-4 w-4" />}
                <AlertTitle className="text-sm font-medium">
                  {issue.type === 'error' ? 'Configuration Error' :
                   issue.type === 'warning' ? 'Consider This' : 'Note'}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <div>{issue.message}</div>
                  {issue.recommendation && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Interpretation Guide */}
      {guide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {guide.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guide.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Statistical References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Statistical References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {references.map((ref, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-4">
              <div className="font-medium text-sm">{ref.title}</div>
              <div className="text-xs text-muted-foreground mb-1">{ref.description}</div>
              <div className="text-xs text-slate-600 font-mono">{ref.citation}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}