
import React from 'react';

export function SEMFormula() {
  return (
    <div>
      <h4>Structural Equation Modeling (SEM)</h4>
      <p>Tests relationships between latent variables in a structural model.</p>
      <p>Null hypothesis: {"$H_0$"}: Specified model fits the population data</p>
      <p>Test statistic: {"$\\chi^2 = (N-1) \\cdot (S - \\Sigma(\\theta))$"}</p>
      <p>where S is the observed covariance matrix and {"$\\Sigma(\\theta)$"} is the model-implied covariance matrix</p>
      <p>Effect size (RMSEA): {"$\\text{RMSEA} = \\sqrt{\\frac{\\chi^2 - df}{df \\cdot (N-1)}}$"}</p>
      <p>Power calculation depends on non-centrality parameter: {"$\\lambda = (N-1) \\cdot df \\cdot \\text{RMSEA}^2$"}</p>
      <p>Power is calculated using the non-central chi-square distribution with df degrees of freedom</p>
    </div>
  );
}
