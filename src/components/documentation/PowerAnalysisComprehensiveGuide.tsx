import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function PowerAnalysisComprehensiveGuide() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Comprehensive Power Analysis Guide</h1>
        <p className="text-lg text-gray-600">Technical documentation and mathematical formulations</p>
      </div>

      <Tabs defaultValue="fundamentals" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="mathematical">Mathematics</TabsTrigger>
          <TabsTrigger value="tests">Statistical Tests</TabsTrigger>
          <TabsTrigger value="effect-sizes">Effect Sizes</TabsTrigger>
          <TabsTrigger value="sample-size">Sample Size</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistical Power Theory</CardTitle>
              <CardDescription>Foundation concepts and definitions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Core Definitions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Statistical Power (1-β)</h4>
                    <p className="text-sm text-blue-800">The probability of correctly rejecting a false null hypothesis. Higher power reduces Type II error risk.</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Type I Error (α)</h4>
                    <p className="text-sm text-red-800">False positive rate. Probability of rejecting a true null hypothesis. Commonly set at 0.05.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Type II Error (β)</h4>
                    <p className="text-sm text-orange-800">False negative rate. Probability of failing to reject a false null hypothesis. Power = 1-β.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Effect Size</h4>
                    <p className="text-sm text-green-800">Standardized measure of the difference between groups or strength of relationships. Independent of sample size.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">The Four Pillars of Power Analysis</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">Power analysis involves four interconnected parameters:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li><strong>Statistical Power (1-β):</strong> Typically set to 0.80 or 0.90</li>
                    <li><strong>Significance Level (α):</strong> Usually 0.05 or 0.01</li>
                    <li><strong>Effect Size:</strong> Depends on the research domain and practical significance</li>
                    <li><strong>Sample Size (n):</strong> The parameter usually solved for in prospective studies</li>
                  </ul>
                  <p className="text-sm mt-2 font-medium">Given any three parameters, the fourth can be calculated.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mathematical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mathematical Formulations</CardTitle>
              <CardDescription>Core equations and statistical theory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Power Formula</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <p>Power = P(Reject H₀ | H₁ is true)</p>
                  <p>Power = P(Test Statistic &gt; Critical Value | H₁)</p>
                  <p>Power = 1 - Φ(z_α - δ)</p>
                  <p className="text-xs text-gray-600 mt-2">where δ is the non-centrality parameter</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">One-Sample t-Test</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-mono text-sm space-y-2">
                    <p><strong>Test Statistic:</strong> t = (x̄ - μ₀) / (s/√n)</p>
                    <p><strong>Non-centrality parameter:</strong> δ = d√n</p>
                    <p><strong>Effect Size (Cohen's d):</strong> d = (μ₁ - μ₀) / σ</p>
                    <p><strong>Power:</strong> Power = 1 - T(t_α,df; δ)</p>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">T(·) is the non-central t-distribution CDF</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Two-Sample t-Test</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="font-mono text-sm space-y-2">
                    <p><strong>Test Statistic:</strong> t = (x̄₁ - x̄₂) / s_pooled√(2/n)</p>
                    <p><strong>Pooled Standard Deviation:</strong> s_pooled = √[(s₁² + s₂²)/2]</p>
                    <p><strong>Non-centrality parameter:</strong> δ = d√(n/2)</p>
                    <p><strong>Effect Size:</strong> d = (μ₁ - μ₂) / σ_pooled</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ANOVA (F-Test)</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="font-mono text-sm space-y-2">
                    <p><strong>Test Statistic:</strong> F = MS_between / MS_within</p>
                    <p><strong>Non-centrality parameter:</strong> λ = nf²</p>
                    <p><strong>Effect Size (Cohen's f):</strong> f = σ_means / σ_error</p>
                    <p><strong>Power:</strong> Power = 1 - F_cdf(F_α,df₁,df₂; λ)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Correlation Analysis</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="font-mono text-sm space-y-2">
                    <p><strong>Test Statistic:</strong> t = r√[(n-2)/(1-r²)]</p>
                    <p><strong>Fisher's Z transformation:</strong> Z = ½ln[(1+r)/(1-r)]</p>
                    <p><strong>Standard Error:</strong> SE_z = 1/√(n-3)</p>
                    <p><strong>Power calculation:</strong> Uses Fisher's Z with normal approximation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>t-Tests</CardTitle>
                <CardDescription>Mean comparison tests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline">One-Sample t-Test</Badge>
                  <p className="text-sm">Compares sample mean to known population value</p>
                  <p className="text-xs text-gray-600">H₀: μ = μ₀ vs H₁: μ ≠ μ₀</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Independent Samples t-Test</Badge>
                  <p className="text-sm">Compares means of two independent groups</p>
                  <p className="text-xs text-gray-600">H₀: μ₁ = μ₂ vs H₁: μ₁ ≠ μ₂</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Paired Samples t-Test</Badge>
                  <p className="text-sm">Compares paired observations (before/after)</p>
                  <p className="text-xs text-gray-600">H₀: μ_d = 0 vs H₁: μ_d ≠ 0</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ANOVA Tests</CardTitle>
                <CardDescription>Analysis of variance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline">One-Way ANOVA</Badge>
                  <p className="text-sm">Compares means across multiple groups</p>
                  <p className="text-xs text-gray-600">H₀: μ₁ = μ₂ = ... = μₖ</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Two-Way ANOVA</Badge>
                  <p className="text-sm">Tests main effects and interactions</p>
                  <p className="text-xs text-gray-600">Multiple factors and their interactions</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Repeated Measures</Badge>
                  <p className="text-sm">Within-subjects factor analysis</p>
                  <p className="text-xs text-gray-600">Accounts for correlation between measures</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regression Analysis</CardTitle>
                <CardDescription>Predictive modeling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline">Linear Regression</Badge>
                  <p className="text-sm">Tests significance of regression coefficient</p>
                  <p className="text-xs text-gray-600">H₀: β = 0 vs H₁: β ≠ 0</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Multiple Regression</Badge>
                  <p className="text-sm">Tests R² significance or individual predictors</p>
                  <p className="text-xs text-gray-600">Overall model or specific coefficients</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi-Square Tests</CardTitle>
                <CardDescription>Categorical data analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline">Goodness of Fit</Badge>
                  <p className="text-sm">Tests if data follows expected distribution</p>
                  <p className="text-xs text-gray-600">H₀: Observed = Expected frequencies</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Test of Independence</Badge>
                  <p className="text-sm">Tests association between categorical variables</p>
                  <p className="text-xs text-gray-600">H₀: Variables are independent</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effect-sizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Effect Size Guidelines</CardTitle>
              <CardDescription>Standardized measures and interpretations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cohen's Conventions</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-semibold text-blue-900">Cohen's d (Mean Differences)</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>Small: d = 0.2</li>
                        <li>Medium: d = 0.5</li>
                        <li>Large: d = 0.8</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-semibold text-green-900">Cohen's f (ANOVA)</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>Small: f = 0.1</li>
                        <li>Medium: f = 0.25</li>
                        <li>Large: f = 0.4</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Other Effect Sizes</h3>
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-3 rounded">
                      <h4 className="font-semibold text-purple-900">Correlation (r)</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>Small: r = 0.1</li>
                        <li>Medium: r = 0.3</li>
                        <li>Large: r = 0.5</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <h4 className="font-semibold text-yellow-900">R² (Regression)</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>Small: R² = 0.01</li>
                        <li>Medium: R² = 0.09</li>
                        <li>Large: R² = 0.25</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Domain-Specific Considerations</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">Cohen's conventions are general guidelines. Consider:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                    <li><strong>Clinical significance:</strong> Effect sizes meaningful for patient outcomes</li>
                    <li><strong>Practical significance:</strong> Real-world importance beyond statistical significance</li>
                    <li><strong>Field norms:</strong> Typical effect sizes in your research domain</li>
                    <li><strong>Cost-benefit:</strong> Resources required for meaningful improvements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample-size" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Size Determination</CardTitle>
              <CardDescription>Planning adequate sample sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900">A Priori Power Analysis</h4>
                    <p className="text-sm text-blue-800">Conducted before data collection to determine required sample size for desired power level.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Post Hoc Power Analysis</h4>
                    <p className="text-sm text-green-800">Calculated after data collection using observed effect size and sample size.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Factors Affecting Sample Size</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Effect Size</p>
                      <p className="text-sm text-gray-600">Smaller effects require larger samples to detect</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Desired Power</p>
                      <p className="text-sm text-gray-600">Higher power (e.g., 0.90 vs 0.80) requires larger samples</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Significance Level</p>
                      <p className="text-sm text-gray-600">Stricter α (e.g., 0.01 vs 0.05) requires larger samples</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Variability</p>
                      <p className="text-sm text-gray-600">Higher population variance requires larger samples</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Practical Considerations</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><strong>Attrition:</strong> Increase sample size by 10-20% to account for dropouts</li>
                    <li><strong>Multiple comparisons:</strong> Adjust for family-wise error rate</li>
                    <li><strong>Unequal groups:</strong> Unbalanced designs reduce power</li>
                    <li><strong>Pilot studies:</strong> Use preliminary data to refine effect size estimates</li>
                    <li><strong>Resource constraints:</strong> Balance statistical power with practical limitations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Topics</CardTitle>
              <CardDescription>Specialized power analysis concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bayesian Power Analysis</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm">Incorporates prior beliefs about effect sizes and uses probability distributions rather than point estimates.</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Uses prior distributions for parameters</li>
                    <li>• Provides posterior probability of effect sizes</li>
                    <li>• More flexible than frequentist approaches</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Adaptive Designs</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm">Allow modifications to trial design based on interim analyses while maintaining statistical validity.</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Sample size re-estimation</li>
                    <li>• Adaptive randomization</li>
                    <li>• Seamless Phase II/III designs</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Multivariate Power Analysis</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">Handles multiple dependent variables simultaneously, controlling for Type I error inflation.</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• MANOVA (Multivariate ANOVA)</li>
                    <li>• Structural Equation Modeling (SEM)</li>
                    <li>• Multiple regression with several outcomes</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Simulation-Based Power</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm">Uses Monte Carlo methods when analytical solutions are complex or unavailable.</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Complex mixed-effects models</li>
                    <li>• Non-parametric tests</li>
                    <li>• Custom statistical procedures</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Equivalence and Non-Inferiority</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm">Testing whether treatments are equivalent rather than different.</p>
                  <div className="font-mono text-xs mt-2 space-y-1">
                    <p>Equivalence: |μ₁ - μ₂| ≤ δ</p>
                    <p>Non-inferiority: μ₁ - μ₂ ≥ -δ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}