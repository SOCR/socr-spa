

export function LogisticRegressionFormula() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Logistic Regression Power Analysis</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Based on Hsieh, Bloch, and Larsen (1998) methodology for binary outcomes
        </p>
      </div>
      
      <div className="bg-muted/50 p-3 rounded border">
        <p className="font-mono text-sm mb-2">Sample Size Formula (Continuous Predictor):</p>
        <div className="text-center my-3 font-mono text-sm">
          N = (Z<sub>1-α/2</sub> + Z<sub>1-β</sub>)² / [P<sub>A</sub>(1-P<sub>A</sub>) · (ln(OR))² · σ<sub>x</sub>²]
        </div>
      </div>
      
      <div className="bg-muted/50 p-3 rounded border">
        <p className="font-mono text-sm mb-2">Sample Size Formula (Binary Predictor):</p>
        <div className="text-center my-3 font-mono text-sm">
          N = (Z<sub>1-α/2</sub> + Z<sub>1-β</sub>)² / [P<sub>A</sub>(1-P<sub>A</sub>) · (ln(OR))² · p<sub>1</sub>(1-p<sub>1</sub>)]
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p><strong>Where:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>N</strong> = Required sample size</li>
          <li><strong>OR</strong> = Odds ratio (effect size as exp(β))</li>
          <li><strong>P<sub>A</sub></strong> = Average probability of outcome</li>
          <li><strong>P<sub>0</sub></strong> = Baseline probability (when predictor = 0 or at mean)</li>
          <li><strong>σ<sub>x</sub>²</strong> = Variance of continuous predictor (1 if standardized)</li>
          <li><strong>p<sub>1</sub></strong> = Proportion with predictor = 1 (binary predictor)</li>
          <li><strong>Z<sub>1-α/2</sub></strong> = Critical value for significance level</li>
          <li><strong>Z<sub>1-β</sub></strong> = Critical value for power</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm">
        <p className="font-semibold mb-1">Odds Ratio Interpretation:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>OR = 1</strong>: No effect (null hypothesis)</li>
          <li><strong>OR = 1.5</strong>: 50% increase in odds (small effect)</li>
          <li><strong>OR = 2.0</strong>: Odds doubled (medium effect)</li>
          <li><strong>OR = 3.0</strong>: Odds tripled (large effect)</li>
          <li><strong>OR &lt; 1</strong>: Protective effect (reduces odds)</li>
        </ul>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-sm">
        <p className="font-semibold mb-1">Key Considerations:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Power is maximized when baseline probability is near 0.5</li>
          <li>Very low (&lt;5%) or very high (&gt;95%) event rates require larger samples</li>
          <li>For rare events, consider exact logistic regression methods</li>
          <li>Multiple predictors require adjustment using variance inflation factors</li>
          <li>Rule of thumb: At least 10 events per predictor variable</li>
        </ul>
      </div>
      
      <div className="bg-green-50 dark:bg-green-950 p-3 rounded text-sm">
        <p className="font-semibold mb-1">Probability Calculation:</p>
        <p className="mb-2">Given P<sub>0</sub> (baseline probability) and OR:</p>
        <div className="font-mono text-xs bg-background/50 p-2 rounded">
          P<sub>1</sub> = (P<sub>0</sub> × OR) / (1 - P<sub>0</sub> + P<sub>0</sub> × OR)
        </div>
        <p className="mt-2 text-muted-foreground">
          Example: If P<sub>0</sub> = 0.25 and OR = 2.0, then P<sub>1</sub> = 0.40
        </p>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4">
        <p><strong>Reference:</strong> Hsieh, F.Y., Bloch, D.A., and Larsen, M.D. (1998). 
        A simple method of sample size calculation for linear and logistic regression. 
        Statistics in Medicine, 17(14), 1623-1634.</p>
      </div>
    </div>
  );
}
