
import React from "react";

export function PowerInstructions() {
  return (
    <div className="mt-8 prose max-w-full">
      <h3>How to Use This Calculator</h3>
      <p>
        This statistical power analyzer helps you understand the relationship between the key components in power analysis:
      </p>
      <ol>
        <li><strong>Statistical Test:</strong> The specific statistical inference method you will use to analyze your data.</li>
        <li><strong>Sample Size:</strong> The number of observations in your study.</li>
        <li><strong>Effect Size:</strong> How large the effect of interest is expected to be.</li>
        <li><strong>Significance Level (α):</strong> The probability of finding an effect that is not there (Type I error).</li>
        <li><strong>Power (1-β):</strong> The probability of finding an effect that is there (sensitivity).</li>
      </ol>
      <p>
        To use the calculator, select which parameter you want to calculate, then provide values for the other parameters.
        The graph shows how the target parameter changes as either sample size or effect size varies.
      </p>
    </div>
  );
}
