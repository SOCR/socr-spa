
import React from 'react';
import { StatisticalTest } from '@/types/power-analysis';

interface TestFormulasProps {
  test: StatisticalTest;
}

export function TestFormulas({ test }: TestFormulasProps) {
  const getFormula = () => {
    switch (test) {
      case 'ttest-one-sample':
        return (
          <div>
            <h4>One-sample t-test</h4>
            <p>Tests if a sample mean differs from a specified value.</p>
            <p>For a two-sided test, the null hypothesis is H₀: μ = μ₀, and the alternative hypothesis is H₁: μ ≠ μ₀.</p>
            <p className="font-mono">t = (x̄ - μ₀) / (s / √n)</p>
            <p>Effect size (Cohen's d): d = |μ - μ₀| / σ</p>
            <p>Power = 1 - β, where β is the probability of Type II error</p>
            <p>Approximate relationship: n ≈ (z₁₋ₐ + z₁₋β)² / d²</p>
          </div>
        );
      
      case 'ttest-two-sample':
        return (
          <div>
            <h4>Two-sample t-test</h4>
            <p>Tests if two independent sample means differ.</p>
            <p>For a two-sided test, the null hypothesis is H₀: μ₁ = μ₂, and the alternative hypothesis is H₁: μ₁ ≠ μ₂.</p>
            <p className="font-mono">t = (x̄₁ - x̄₂) / √(s₁² / n₁ + s₂² / n₂)</p>
            <p>Effect size (Cohen's d): d = |μ₁ - μ₂| / √((σ₁² + σ₂²) / 2)</p>
            <p>Approximate relationship: n = 2(z₁₋ₐ + z₁₋β)² / d²</p>
          </div>
        );

      case 'ttest-paired':
        return (
          <div>
            <h4>Paired t-test</h4>
            <p>Tests if means of paired observations differ.</p>
            <p>For a two-sided test, the null hypothesis is H₀: μᵈ = 0, and the alternative hypothesis is H₁: μᵈ ≠ 0.</p>
            <p className="font-mono">t = d̄ / (sᵈ / √n)</p>
            <p>Effect size: d = |μᵈ| / σᵈ</p>
            <p>Power influenced by within-pair correlation ρ: d' = d / √(2(1-ρ))</p>
          </div>
        );
        
      case 'anova':
        return (
          <div>
            <h4>One-way ANOVA</h4>
            <p>Tests if means of three or more groups differ.</p>
            <p>Null hypothesis: H₀: μ₁ = μ₂ = ... = μₖ</p>
            <p className="font-mono">F = MSB / MSW</p>
            <p>Effect size (Cohen's f): f = √(η² / (1-η²)) where η² = SSB / SST</p>
            <p>Power calculation depends on non-centrality parameter: λ = n⋅f² where n is the sample size per group</p>
          </div>
        );
        
      case 'anova-two-way':
        return (
          <div>
            <h4>Two-way ANOVA</h4>
            <p>Tests main effects and interactions between two factors.</p>
            <p>Null hypotheses: (1) H₀: No main effect of factor A, (2) H₀: No main effect of factor B, (3) H₀: No interaction effect</p>
            <p className="font-mono">F = MS_effect / MS_error</p>
            <p>Effect size (Cohen's f): f = √(η² / (1-η²))</p>
            <p>Power depends on non-centrality parameters for each effect</p>
          </div>
        );
        
      case 'correlation':
        return (
          <div>
            <h4>Correlation</h4>
            <p>Tests if correlation coefficient differs from zero.</p>
            <p>Null hypothesis: H₀: ρ = 0</p>
            <p className="font-mono">t = r√(n-2) / √(1-r²)</p>
            <p>Effect size: r (the correlation coefficient itself)</p>
            <p>Sample size estimation: n ≥ [(z₁₋ₐ + z₁₋β) / (0.5ln((1+r)/(1-r)))]² + 3</p>
          </div>
        );
        
      case 'correlation-difference':
        return (
          <div>
            <h4>Differences between Correlations</h4>
            <p>Tests if two correlation coefficients differ.</p>
            <p>Null hypothesis: H₀: ρ₁ = ρ₂</p>
            <p>Using Fisher's z transformation: z = 0.5 ln((1+r)/(1-r))</p>
            <p className="font-mono">z_test = (z₁ - z₂) / √(1/(n₁-3) + 1/(n₂-3))</p>
            <p>Effect size: |r₁ - r₂|</p>
          </div>
        );
        
      case 'chi-square-gof':
        return (
          <div>
            <h4>Chi-square Goodness of Fit</h4>
            <p>Tests if observed frequencies match expected frequencies.</p>
            <p>Null hypothesis: H₀: The data follow a specified distribution</p>
            <p className="font-mono">χ² = Σ (O - E)² / E</p>
            <p>Effect size (Cohen's w): w = √(Σ (p₁ᵢ - p₀ᵢ)² / p₀ᵢ)</p>
            <p>Power calculation uses the non-central chi-square distribution</p>
          </div>
        );
        
      case 'chi-square-contingency':
        return (
          <div>
            <h4>Chi-square Contingency Tables</h4>
            <p>Tests association between categorical variables.</p>
            <p>Null hypothesis: H₀: The two variables are independent</p>
            <p className="font-mono">χ² = Σ (O - E)² / E where E = (row total × column total) / grand total</p>
            <p>Effect size (Cohen's w): w = √(χ² / N)</p>
            <p>Power calculation uses the non-central chi-square distribution</p>
          </div>
        );
        
      case 'proportion-test':
        return (
          <div>
            <h4>Proportion Test</h4>
            <p>Tests if a proportion equals 0.50.</p>
            <p>Null hypothesis: H₀: p = 0.5</p>
            <p className="font-mono">z = (p̂ - 0.5) / √(0.25/n)</p>
            <p>Effect size (Cohen's h): h = 2arcsin(√p) - 2arcsin(√0.5)</p>
            <p>Sample size: n ≈ (z₁₋ₐ + z₁₋β)² / h²</p>
          </div>
        );
        
      case 'proportion-difference':
        return (
          <div>
            <h4>Differences between Proportions</h4>
            <p>Tests if two proportions differ.</p>
            <p>Null hypothesis: H₀: p₁ = p₂</p>
            <p className="font-mono">z = (p̂₁ - p̂₂) / √(p̂(1-p̂)(1/n₁ + 1/n₂))</p>
            <p>Effect size (Cohen's h): h = 2arcsin(√p₁) - 2arcsin(√p₂)</p>
            <p>Sample size per group: n ≈ 2(z₁₋ₐ + z₁₋β)² / h²</p>
          </div>
        );
        
      case 'sign-test':
        return (
          <div>
            <h4>Sign Test</h4>
            <p>Tests if the median equals a specified value.</p>
            <p>Null hypothesis: H₀: Median = M₀</p>
            <p>Based on the binomial distribution with p = 0.5</p>
            <p className="font-mono">z = (S - 0.5n) / 0.5√n</p>
            <p>where S is the number of values above (or below) M₀</p>
            <p>Effect size: probability of exceeding the median under H₁</p>
          </div>
        );
        
      case 'linear-regression':
        return (
          <div>
            <h4>Simple Linear Regression</h4>
            <p>Tests if regression slope differs from zero.</p>
            <p>Null hypothesis: H₀: β = 0</p>
            <p className="font-mono">t = b / s_b where s_b = s_e / √Σ(x_i - x̄)²</p>
            <p>Effect size (f²): f² = R² / (1-R²)</p>
            <p>Power depends on non-centrality parameter: λ = f²(n-2)</p>
          </div>
        );
        
      case 'multiple-regression':
        return (
          <div>
            <h4>Multiple Regression</h4>
            <p>Tests if multiple regression coefficients differ from zero.</p>
            <p>Null hypothesis: H₀: β₁ = β₂ = ... = βₖ = 0</p>
            <p className="font-mono">F = (R² / k) / ((1 - R²) / (n - k - 1))</p>
            <p>Effect size (f²): f² = R² / (1-R²)</p>
            <p>Power depends on non-centrality parameter: λ = f²(n-k-1)</p>
          </div>
        );
        
      case 'set-correlation':
        return (
          <div>
            <h4>Set Correlation</h4>
            <p>Tests correlation between sets of variables.</p>
            <p>Null hypothesis: H₀: R² = 0</p>
            <p>Based on canonical correlation analysis</p>
            <p className="font-mono">Wilks' Λ = Π(1/(1+λᵢ))</p>
            <p>where λᵢ are the eigenvalues of the correlation matrix</p>
            <p>Effect size (f²): f² = R² / (1-R²)</p>
          </div>
        );
        
      case 'multivariate':
        return (
          <div>
            <h4>Multivariate Methods</h4>
            <p>Tests effects in multivariate designs.</p>
            <p>Includes MANOVA, discriminant analysis, etc.</p>
            <p>Various test statistics: Wilks' λ, Hotelling's trace, Pillai's trace, Roy's largest root</p>
            <p className="font-mono">Wilks' Λ = |E| / |E + H|</p>
            <p>Effect size: typically uses variations of f or Mahalanobis distance</p>
            <p>Power calculations are complex and depend on the specific test and design</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 border-t pt-6 prose-sm max-w-full">
      <h3>Mathematical Formula</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        {getFormula()}
      </div>
    </div>
  );
}
