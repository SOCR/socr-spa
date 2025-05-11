
import React from 'react';

export function TTestOneFormula() {
  return (
    <div>
      <h4>One-sample t-test</h4>
      <p>Tests if a sample mean differs from a specified value.</p>
      <p>For a two-sided test, the null hypothesis is {"$H_0: \\mu = \\mu_0$"}, and the alternative hypothesis is {"$H_1: \\mu \\neq \\mu_0$"}.</p>
      <p>Test statistic: {"$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$"}</p>
      <p>Effect size (Cohen&apos;s d): {"$d = \\frac{|\\mu - \\mu_0|}{\\sigma}$"}</p>
      <p>Power = {"$1 - \\beta$"}, where {"$\\beta$"} is the probability of Type II error</p>
      <p>Approximate relationship: {"$n \\approx \\frac{(z_{1-\\alpha} + z_{1-\\beta})^2}{d^2}$"}</p>
    </div>
  );
}

export function TTestTwoFormula() {
  return (
    <div>
      <h4>Two-sample t-test</h4>
      <p>Tests if two independent sample means differ.</p>
      <p>For a two-sided test, the null hypothesis is {"$H_0: \\mu_1 = \\mu_2$"}, and the alternative hypothesis is {"$H_1: \\mu_1 \\neq \\mu_2$"}.</p>
      <p>Test statistic: {"$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$"}</p>
      <p>Effect size (Cohen&apos;s d): {"$d = \\frac{|\\mu_1 - \\mu_2|}{\\sqrt{\\frac{\\sigma_1^2 + \\sigma_2^2}{2}}}$"}</p>
      <p>Approximate relationship: {"$n = \\frac{2(z_{1-\\alpha} + z_{1-\\beta})^2}{d^2}$"}</p>
    </div>
  );
}

export function TTestPairedFormula() {
  return (
    <div>
      <h4>Paired t-test</h4>
      <p>Tests if means of paired observations differ.</p>
      <p>For a two-sided test, the null hypothesis is {"$H_0: \\mu_d = 0$"}, and the alternative hypothesis is {"$H_1: \\mu_d \\neq 0$"}.</p>
      <p>Test statistic: {"$t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}$"}</p>
      <p>Effect size: {"$d = \\frac{|\\mu_d|}{\\sigma_d}$"}</p>
      <p>Power influenced by within-pair correlation {"$\\rho$"}: {"$d' = \\frac{d}{\\sqrt{2(1-\\rho)}}$"}</p>
    </div>
  );
}

export function AnovaFormula() {
  return (
    <div>
      <h4>One-way ANOVA</h4>
      <p>Tests if means of three or more groups differ.</p>
      <p>Null hypothesis: {"$H_0: \\mu_1 = \\mu_2 = ... = \\mu_k$"}</p>
      <p>Test statistic: {"$F = \\frac{MSB}{MSW}$"}</p>
      <p>Effect size (Cohen&apos;s f): {"$f = \\sqrt{\\frac{\\eta^2}{1-\\eta^2}}$"} where {"$\\eta^2 = \\frac{SSB}{SST}$"}</p>
      <p>Power calculation depends on non-centrality parameter: {"$\\lambda = n \\cdot f^2$"} where n is the sample size per group</p>
    </div>
  );
}

export function AnovaTwoWayFormula() {
  return (
    <div>
      <h4>Two-way ANOVA</h4>
      <p>Tests main effects and interactions between two factors.</p>
      <p>Null hypotheses: (1) {"$H_0$"}: No main effect of factor A, (2) {"$H_0$"}: No main effect of factor B, (3) {"$H_0$"}: No interaction effect</p>
      <p>Test statistic: {"$F = \\frac{MS_{effect}}{MS_{error}}$"}</p>
      <p>Effect size (Cohen&apos;s f): {"$f = \\sqrt{\\frac{\\eta^2}{1-\\eta^2}}$"}</p>
      <p>Power depends on non-centrality parameters for each effect</p>
    </div>
  );
}

export function CorrelationFormula() {
  return (
    <div>
      <h4>Correlation</h4>
      <p>Tests if correlation coefficient differs from zero.</p>
      <p>Null hypothesis: {"$H_0: \\rho = 0$"}</p>
      <p>Test statistic: {"$t = \\frac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}$"}</p>
      <p>Effect size: {"$r$"} (the correlation coefficient itself)</p>
      <p>Sample size estimation: {"$n \\geq \\left[\\frac{(z_{1-\\alpha} + z_{1-\\beta})}{0.5\\ln\\left(\\frac{1+r}{1-r}\\right)}\\right]^2 + 3$"}</p>
    </div>
  );
}

export function CorrelationDiffFormula() {
  return (
    <div>
      <h4>Differences between Correlations</h4>
      <p>Tests if two correlation coefficients differ.</p>
      <p>Null hypothesis: {"$H_0: \\rho_1 = \\rho_2$"}</p>
      <p>Using Fisher&apos;s z transformation: {"$z = 0.5 \\ln\\left(\\frac{1+r}{1-r}\\right)$"}</p>
      <p>Test statistic: {"$z_{test} = \\frac{z_1 - z_2}{\\sqrt{\\frac{1}{n_1-3} + \\frac{1}{n_2-3}}}$"}</p>
      <p>Effect size: {"$|r_1 - r_2|$"}</p>
    </div>
  );
}

export function ChiSquareGofFormula() {
  return (
    <div>
      <h4>Chi-square Goodness of Fit</h4>
      <p>Tests if observed frequencies match expected frequencies.</p>
      <p>Null hypothesis: {"$H_0$"}: The data follow a specified distribution</p>
      <p>Test statistic: {"$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$"}</p>
      <p>Effect size (Cohen&apos;s w): {"$w = \\sqrt{\\sum \\frac{(p_{1i} - p_{0i})^2}{p_{0i}}}$"}</p>
      <p>Power calculation uses the non-central chi-square distribution</p>
    </div>
  );
}

export function ChiSquareContingencyFormula() {
  return (
    <div>
      <h4>Chi-square Contingency Tables</h4>
      <p>Tests association between categorical variables.</p>
      <p>Null hypothesis: {"$H_0$"}: The two variables are independent</p>
      <p>Test statistic: {"$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$"} where {"$E = \\frac{\\text{row total} \\times \\text{column total}}{\\text{grand total}}$"}</p>
      <p>Effect size (Cohen&apos;s w): {"$w = \\sqrt{\\frac{\\chi^2}{N}}$"}</p>
      <p>Power calculation uses the non-central chi-square distribution</p>
    </div>
  );
}

export function ProportionTestFormula() {
  return (
    <div>
      <h4>Proportion Test</h4>
      <p>Tests if a proportion equals 0.50.</p>
      <p>Null hypothesis: {"$H_0: p = 0.5$"}</p>
      <p>Test statistic: {"$z = \\frac{\\hat{p} - 0.5}{\\sqrt{\\frac{0.25}{n}}}$"}</p>
      <p>Effect size (Cohen&apos;s h): {"$h = 2\\arcsin(\\sqrt{p}) - 2\\arcsin(\\sqrt{0.5})$"}</p>
      <p>Sample size: {"$n \\approx \\frac{(z_{1-\\alpha} + z_{1-\\beta})^2}{h^2}$"}</p>
    </div>
  );
}

export function ProportionDiffFormula() {
  return (
    <div>
      <h4>Differences between Proportions</h4>
      <p>Tests if two proportions differ.</p>
      <p>Null hypothesis: {"$H_0: p_1 = p_2$"}</p>
      <p>Test statistic: {"$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})(\\frac{1}{n_1} + \\frac{1}{n_2})}}$"}</p>
      <p>Effect size (Cohen&apos;s h): {"$h = 2\\arcsin(\\sqrt{p_1}) - 2\\arcsin(\\sqrt{p_2})$"}</p>
      <p>Sample size per group: {"$n \\approx \\frac{2(z_{1-\\alpha} + z_{1-\\beta})^2}{h^2}$"}</p>
    </div>
  );
}

export function SignTestFormula() {
  return (
    <div>
      <h4>Sign Test</h4>
      <p>Tests if the median equals a specified value.</p>
      <p>Null hypothesis: {"$H_0$"}: Median = {"$M_0$"}</p>
      <p>Based on the binomial distribution with {"$p = 0.5$"}</p>
      <p>Test statistic: {"$z = \\frac{S - 0.5n}{0.5\\sqrt{n}}$"}</p>
      <p>where S is the number of values above (or below) {"$M_0$"}</p>
      <p>Effect size: probability of exceeding the median under {"$H_1$"}</p>
    </div>
  );
}

export function LinearRegressionFormula() {
  return (
    <div>
      <h4>Simple Linear Regression</h4>
      <p>Tests if regression slope differs from zero.</p>
      <p>Null hypothesis: {"$H_0: \\beta = 0$"}</p>
      <p>Test statistic: {"$t = \\frac{b}{s_b}$"} where {"$s_b = \\frac{s_e}{\\sqrt{\\sum(x_i - \\bar{x})^2}}$"}</p>
      <p>Effect size ({"$f^2$"}): {"$f^2 = \\frac{R^2}{1-R^2}$"}</p>
      <p>Power depends on non-centrality parameter: {"$\\lambda = f^2(n-2)$"}</p>
    </div>
  );
}

export function MultipleRegressionFormula() {
  return (
    <div>
      <h4>Multiple Regression</h4>
      <p>Tests if multiple regression coefficients differ from zero.</p>
      <p>Null hypothesis: {"$H_0: \\beta_1 = \\beta_2 = ... = \\beta_k = 0$"}</p>
      <p>Test statistic: {"$F = \\frac{R^2 / k}{(1 - R^2) / (n - k - 1)}$"}</p>
      <p>Effect size ({"$f^2$"}): {"$f^2 = \\frac{R^2}{1-R^2}$"}</p>
      <p>Power depends on non-centrality parameter: {"$\\lambda = f^2(n-k-1)$"}</p>
    </div>
  );
}

export function SetCorrelationFormula() {
  return (
    <div>
      <h4>Set Correlation</h4>
      <p>Tests correlation between sets of variables.</p>
      <p>Null hypothesis: {"$H_0: R^2 = 0$"}</p>
      <p>Based on canonical correlation analysis</p>
      <p>Test statistic: {"$\\text{Wilks'} \\Lambda = \\prod\\frac{1}{1+\\lambda_i}$"}</p>
      <p>where {"$\\lambda_i$"} are the eigenvalues of the correlation matrix</p>
      <p>Effect size ({"$f^2$"}): {"$f^2 = \\frac{R^2}{1-R^2}$"}</p>
    </div>
  );
}

export function MultivariateFormula() {
  return (
    <div>
      <h4>Multivariate Methods</h4>
      <p>Tests effects in multivariate designs.</p>
      <p>Includes MANOVA, discriminant analysis, etc.</p>
      <p>Various test statistics: Wilks' λ, Hotelling's trace, Pillai's trace, Roy's largest root</p>
      <p>Test statistic: {"$\\text{Wilks'} \\Lambda = \\frac{|E|}{|E + H|}$"}</p>
      <p>Effect size: typically uses variations of f or Mahalanobis distance</p>
      <p>Power calculations are complex and depend on the specific test and design</p>
    </div>
  );
}
