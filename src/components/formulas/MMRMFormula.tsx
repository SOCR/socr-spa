import React from 'react';

export function MMRMFormula() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Mixed-Model Repeated Measures (MMRM) Power</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Based on Lu, Luo, & Chen (2008) methodology for longitudinal designs with dropout
        </p>
      </div>
      
      <div className="bg-card p-3 rounded border border-border">
        <p className="font-mono text-sm mb-2">Sample Size Formula:</p>
        <div className="text-center my-3 text-sm">
          <code>N = (φ₁ + λ·φ₂) × (z_α/2 + z_β)² / δ²</code>
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p><strong>Where:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
          <li><strong>N</strong> = Total sample size across all groups</li>
          <li><strong>δ</strong> = Standardized effect size (treatment difference / SD)</li>
          <li><strong>φ₁, φ₂</strong> = Variance inflation factors accounting for correlation and dropout</li>
          <li><strong>λ</strong> = Allocation ratio (typically 1 for equal groups)</li>
          <li><strong>z_α/2</strong> = Critical value for significance level α</li>
          <li><strong>z_β</strong> = Critical value for power 1-β</li>
        </ul>
      </div>
      
      <div className="bg-muted p-3 rounded text-sm">
        <p className="font-semibold mb-1">Key Assumptions:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
          <li>Missing data are missing at random (MAR)</li>
          <li>Monotone dropout pattern (once dropped, stays dropped)</li>
          <li>Tests group × time interaction at final time point</li>
          <li>Compound symmetry correlation structure</li>
        </ul>
      </div>
      
      <div className="bg-accent/20 p-3 rounded text-sm">
        <p className="font-semibold mb-1">Design Considerations:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
          <li><strong>Effect Size</strong>: Typically 0.3-0.5 for clinical trials</li>
          <li><strong>Time Points</strong>: More time points increase power but also dropout risk</li>
          <li><strong>Correlation</strong>: Higher within-subject correlation (0.4-0.7) increases power</li>
          <li><strong>Dropout</strong>: Account for 5-20% attrition in longitudinal studies</li>
        </ul>
      </div>
    </div>
  );
}
