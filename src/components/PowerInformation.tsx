
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PowerInformation() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Understanding Statistical Power Analysis</CardTitle>
        <CardDescription>Key concepts and relationships between parameters</CardDescription>
      </CardHeader>
      <CardContent className="prose max-w-full">
        <h3>What is Power Analysis?</h3>
        <p>
          Power analysis is a statistical approach that explicates the relations between multiple parameters that affect experimental designs. 
          It helps researchers determine the sample size needed to detect an effect of a given size with a specified level of confidence.
        </p>
        
        <h3>The Five Key Components</h3>
        <ol>
          <li>
            <strong>Statistical Test:</strong> The specific statistical inference method used to analyze your data (e.g., t-test, ANOVA, correlation).
          </li>
          <li>
            <strong>Sample Size:</strong> The number of observations in your study. Larger samples provide more statistical power but require more resources.
          </li>
          <li>
            <strong>Effect Size:</strong> How strong the expected effect is. Common measures include:
            <ul>
              <li>Cohen's d (t-tests): 0.2 (small), 0.5 (medium), 0.8 (large)</li>
              <li>Cohen's f (ANOVA): 0.1 (small), 0.25 (medium), 0.4 (large)</li>
              <li>Cohen's r (correlation): 0.1 (small), 0.3 (medium), 0.5 (large)</li>
              <li>Cohen's w (chi-square): 0.1 (small), 0.3 (medium), 0.5 (large)</li>
              <li>Cohen's f² (regression): 0.02 (small), 0.15 (medium), 0.35 (large)</li>
            </ul>
          </li>
          <li>
            <strong>Significance Level (α):</strong> The probability of Type I error (false positive) - finding an effect that isn't actually there. 
            Commonly set at 0.05.
          </li>
          <li>
            <strong>Power (1-β):</strong> The probability of detecting a true effect (sensitivity). 
            Equals 1 minus the probability of a Type II error (false negative). 
            Power of 0.8 (80%) is often considered acceptable.
          </li>
        </ol>
        
        <h3>Relationship Between Parameters</h3>
        <p>
          These five parameters are interconnected. When you specify any four of them, you can calculate the fifth:
        </p>
        <ul>
          <li>Increasing sample size → increases power</li>
          <li>Larger effect sizes → increases power</li>
          <li>Stricter significance level (smaller α) → decreases power</li>
          <li>Higher required power → requires larger sample sizes</li>
        </ul>
        
        <h3>Statistical Tests and Effect Size Measures</h3>
        
        <h4>T-Tests</h4>
        <p>
          <strong>Cohen's d</strong> measures the standardized difference between two means:
          d = (Mean₁ - Mean₂) / Pooled Standard Deviation
        </p>
        
        <h4>ANOVA</h4>
        <p>
          <strong>Cohen's f</strong> is used for ANOVA:
          f = sqrt(η² / (1 - η²)) where η² (eta squared) is the proportion of variance explained.
        </p>
        
        <h4>Correlation</h4>
        <p>
          <strong>Cohen's r</strong> is the correlation coefficient itself.
        </p>
        
        <h4>Chi-Square Tests</h4>
        <p>
          <strong>Cohen's w</strong> represents the discrepancy between observed and expected proportions.
        </p>
        
        <h4>Linear Regression</h4>
        <p>
          <strong>Cohen's f²</strong> is calculated as R² / (1 - R²) where R² is the coefficient of determination.
        </p>

        <h3>Common Scenarios</h3>
        <ol>
          <li>
            <strong>Sample Size Determination:</strong> When planning a study, researchers often want to know how many participants they need to detect an expected effect size with adequate power.
          </li>
          <li>
            <strong>Power Calculation:</strong> After a study is completed or with a fixed sample size, calculating the power to detect various effect sizes helps interpret results.
          </li>
          <li>
            <strong>Minimum Detectable Effect:</strong> For a fixed sample size and desired power, calculating the smallest effect size that can be reliably detected.
          </li>
        </ol>
        
        <h3>Important Considerations</h3>
        <ul>
          <li>Power analyses are based on statistical assumptions that should be carefully evaluated.</li>
          <li>Effect size estimates from previous studies may not be directly applicable to new research contexts.</li>
          <li>Practical significance (meaningful real-world impact) is distinct from statistical significance.</li>
          <li>Overpowered studies might detect trivially small effects with little practical importance.</li>
          <li>Underpowered studies risk failing to detect meaningful effects.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
