/**
 * Simulation Methodology Documentation
 */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Beaker, Calculator, GitBranch } from 'lucide-react';

export function SimulationMethodology() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-5 w-5" />
          Methodology
        </CardTitle>
        <CardDescription>
          Understanding simulation-based power analysis for transfer learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Why Simulation-Based Power Analysis?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-3">
              <p>
                Traditional power analysis relies on closed-form formulas derived from asymptotic theory. 
                However, many modern statistical scenarios—particularly transfer learning—lack such formulas because:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The underlying distributions are complex or unknown</li>
                <li>Domain shift introduces non-standard statistical behavior</li>
                <li>Model performance depends on data-dependent training</li>
                <li>The relationship between sample size and power is non-linear</li>
              </ul>
              <p>
                Simulation-based power analysis overcomes these limitations by directly estimating power 
                through Monte Carlo methods.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="monte-carlo">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Power Estimation via Monte Carlo
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-3">
              <p>Power is estimated as the proportion of simulations meeting the success criterion:</p>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                Power = (# simulations where metric &gt; threshold) / (total simulations)
              </div>
              <p>For each (sample size, domain shift) combination, we:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Generate synthetic source and target data with known structure</li>
                <li>Train a model on source data</li>
                <li>Evaluate performance on target data</li>
                <li>Check if performance exceeds the threshold</li>
                <li>Repeat 500+ times and compute the success rate</li>
              </ol>
              <p className="mt-2">
                <strong>Confidence Intervals:</strong> Wilson score intervals provide accurate coverage 
                for proportions, especially with extreme success rates:
              </p>
              <div className="bg-muted p-4 rounded font-mono text-xs">
                CI = (p + z²/2n ± z√(p(1-p)/n + z²/4n²)) / (1 + z²/n)
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="domain-shift">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Domain Shift (Maximum Mean Discrepancy)
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-3">
              <p>
                Maximum Mean Discrepancy (MMD) quantifies the difference between source and target distributions. 
                It's the core measure of domain shift in transfer learning:
              </p>
              <div className="bg-muted p-4 rounded font-mono text-xs">
                MMD²(P, Q) = E[k(x,x')] + E[k(y,y')] - 2E[k(x,y)]
              </div>
              <p>where k(·,·) is a Gaussian (RBF) kernel. Interpretation:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>MMD ≈ 0:</strong> Source and target are similar (good transfer expected)</li>
                <li><strong>MMD ≈ 0.5:</strong> Moderate domain shift</li>
                <li><strong>MMD &gt; 1.0:</strong> Substantial difference (poor transfer expected)</li>
              </ul>
              <p className="mt-2">
                In cross-species transfer (e.g., mice → humans), MMD captures differences in:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Gene expression patterns</li>
                <li>Metabolic pathways</li>
                <li>Drug response mechanisms</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-generation">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Data Generation Model
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-3">
              <p>Synthetic data is generated with controlled cross-species structure:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Shared latent signal:</strong> Features with predictive power that transfer 
                  between species (controlled by <em>sharedVariance</em>)
                </li>
                <li>
                  <strong>Species-specific variation:</strong> Features that differ between source and target 
                  (controlled by <em>domainShift</em> and <em>speciesSpecificNoise</em>)
                </li>
                <li>
                  <strong>Feature correlation:</strong> Within-domain correlation structure 
                  (controlled by <em>featureCorrelation</em>)
                </li>
                <li>
                  <strong>Outcome generation:</strong> Binary labels via logistic model with species-specific 
                  prevalence
                </li>
              </ol>
              <p className="mt-2">
                This model captures the key challenge of transfer learning: extracting transferable signal 
                while accounting for domain-specific noise.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="references">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                References
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-2">
              <ul className="space-y-2">
                <li>
                  <strong>Gretton, A. et al. (2012).</strong> A Kernel Two-Sample Test. 
                  <em> Journal of Machine Learning Research</em>, 13, 723-773.
                </li>
                <li>
                  <strong>Pan, S. J., & Yang, Q. (2010).</strong> A Survey on Transfer Learning. 
                  <em> IEEE Transactions on Knowledge and Data Engineering</em>, 22(10), 1345-1359.
                </li>
                <li>
                  <strong>Arnold, B. F., Hogan, D. R., Colford, J. M., & Hubbard, A. E. (2011).</strong> 
                  Simulation methods to estimate design power. <em>BMC Medical Research Methodology</em>, 11, 94.
                </li>
                <li>
                  <strong>Cohen, J. (1988).</strong> Statistical Power Analysis for the Behavioral Sciences. 
                  Lawrence Erlbaum Associates.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
