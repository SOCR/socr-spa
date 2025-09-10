import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Calculator, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export function PowerAnalysisGuide() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Comprehensive Power Analysis Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="prose max-w-none">
              <h3>What is Statistical Power Analysis?</h3>
              <p>
                Statistical power analysis is a systematic approach to understanding the relationship between 
                four key statistical parameters that determine the adequacy of research designs. It helps 
                researchers make informed decisions about sample sizes, detect meaningful effects, and 
                interpret study results appropriately.
              </p>

              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calculator className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Sample Size Planning</div>
                        <div className="text-sm text-muted-foreground">Determine adequate sample sizes before data collection</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Effect Detection</div>
                        <div className="text-sm text-muted-foreground">Calculate power to detect specific effect sizes</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Study Evaluation</div>
                        <div className="text-sm text-muted-foreground">Assess adequacy of completed studies</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">The Four Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Sample Size (n)</Badge>
                      <div className="text-sm text-muted-foreground">Number of observations or participants</div>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">Effect Size</Badge>
                      <div className="text-sm text-muted-foreground">Magnitude of the difference or relationship</div>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">Significance Level (α)</Badge>
                      <div className="text-sm text-muted-foreground">Probability of Type I error (false positive)</div>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">Power (1-β)</Badge>
                      <div className="text-sm text-muted-foreground">Probability of detecting true effects</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Understanding Effect Sizes</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cohen's d (t-tests)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Small effect:</span>
                        <Badge variant="outline">d = 0.2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medium effect:</span>
                        <Badge variant="outline">d = 0.5</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Large effect:</span>
                        <Badge variant="outline">d = 0.8</Badge>
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm">
                          Represents standardized mean difference. For example, d = 0.5 means groups differ by half a standard deviation.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cohen's f (ANOVA)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Small effect:</span>
                        <Badge variant="outline">f = 0.1</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medium effect:</span>
                        <Badge variant="outline">f = 0.25</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Large effect:</span>
                        <Badge variant="outline">f = 0.4</Badge>
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm">
                          Related to eta-squared (η²). Measures proportion of variance explained by group differences.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Correlation (r)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Small effect:</span>
                        <Badge variant="outline">r = 0.1</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medium effect:</span>
                        <Badge variant="outline">r = 0.3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Large effect:</span>
                        <Badge variant="outline">r = 0.5</Badge>
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm">
                          Pearson correlation coefficient. r² gives proportion of shared variance.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>f² (Regression)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Small effect:</span>
                        <Badge variant="outline">f² = 0.02</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medium effect:</span>
                        <Badge variant="outline">f² = 0.15</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Large effect:</span>
                        <Badge variant="outline">f² = 0.35</Badge>
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm">
                          Calculated as R²/(1-R²). Represents variance explained relative to unexplained variance.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interpretation" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Interpreting Results</h3>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Key Principle</AlertTitle>
                <AlertDescription>
                  Power analysis results should always be interpreted within the specific research context. 
                  Cohen's conventions are guidelines, not absolute rules.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Power Levels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Power &lt; 0.5:</span>
                        <Badge variant="destructive">Inadequate</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">High risk of missing true effects</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>0.5 ≤ Power &lt; 0.8:</span>
                        <Badge variant="outline">Below Standard</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">May miss important effects</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>0.8 ≤ Power &lt; 0.9:</span>
                        <Badge variant="default">Good</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Standard acceptable level</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Power ≥ 0.9:</span>
                        <Badge variant="default">Excellent</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">High sensitivity to effects</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sample Size Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Very Small (n &lt; 20):</strong> Limited power except for very large effects. 
                        Consider increasing sample size or adjusting expectations.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription>
                        <strong>Small (20 ≤ n &lt; 50):</strong> Adequate for large effects, limited for small effects. 
                        Verify effect size expectations are realistic.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription>
                        <strong>Medium (50 ≤ n &lt; 200):</strong> Good power for medium to large effects. 
                        Standard range for many research studies.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription>
                        <strong>Large (n ≥ 200):</strong> High power for small to medium effects.
                        Consider practical significance of small effects detected.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Best Practices</h3>
              
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Before Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Literature Review:</strong> Examine previous studies for realistic effect size estimates
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Pilot Studies:</strong> Conduct small-scale studies to estimate parameters
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Multiple Scenarios:</strong> Calculate sample sizes for different effect sizes
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Practical Constraints:</strong> Consider budget, time, and participant availability
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>During Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Check Assumptions:</strong> Verify statistical test assumptions are met
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Report Power:</strong> Include achieved power in results
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Effect Size Confidence:</strong> Report confidence intervals for effect sizes
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Common Pitfalls to Avoid</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Post-hoc Power Analysis:</strong> Calculating power after finding non-significant results 
                        is generally uninformative and should be avoided.
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Ignoring Practical Significance:</strong> Statistical significance doesn't guarantee 
                        practical or clinical significance.
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Assuming Universal Effect Sizes:</strong> Effect sizes vary across domains, 
                        populations, and contexts.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Troubleshooting Common Issues</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Size Too Large</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Problem:</strong> Calculated sample size exceeds practical constraints</p>
                    <div className="space-y-2">
                      <p><strong>Solutions:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Re-examine effect size expectations (may be too optimistic)</li>
                        <li>Consider increasing significance level (e.g., from 0.01 to 0.05)</li>
                        <li>Reduce required power (e.g., from 0.9 to 0.8)</li>
                        <li>Use more efficient study designs (paired vs. independent samples)</li>
                        <li>Consider stratified sampling or blocking</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Power Too Low</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Problem:</strong> Study has insufficient power to detect meaningful effects</p>
                    <div className="space-y-2">
                      <p><strong>Solutions:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Increase sample size if possible</li>
                        <li>Use more sensitive measurement instruments</li>
                        <li>Reduce measurement error through standardization</li>
                        <li>Consider different statistical approaches (one-tailed vs. two-tailed)</li>
                        <li>Focus on larger, more detectable effects</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Uncertain Effect Size</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Problem:</strong> No prior information about expected effect size</p>
                    <div className="space-y-2">
                      <p><strong>Solutions:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Conduct systematic literature review</li>
                        <li>Perform small pilot study</li>
                        <li>Use Cohen's conventional values as starting point</li>
                        <li>Calculate sample sizes for multiple effect sizes</li>
                        <li>Consider adaptive trial designs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}