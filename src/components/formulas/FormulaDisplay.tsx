
import React from 'react';
import { StatisticalTest } from '@/types/power-analysis';
import { 
  TTestOneFormula,
  TTestTwoFormula,
  TTestPairedFormula,
  AnovaFormula,
  AnovaTwoWayFormula,
  CorrelationFormula,
  CorrelationDiffFormula,
  ChiSquareGofFormula,
  ChiSquareContingencyFormula,
  ProportionTestFormula,
  ProportionDiffFormula,
  SignTestFormula,
  LinearRegressionFormula,
  MultipleRegressionFormula,
  SetCorrelationFormula,
  MultivariateFormula
} from './testFormulas';

interface FormulaDisplayProps {
  test: StatisticalTest;
}

export function FormulaDisplay({ test }: FormulaDisplayProps) {
  switch (test) {
    case 'ttest-one-sample':
      return <TTestOneFormula />;
    case 'ttest-two-sample':
      return <TTestTwoFormula />;
    case 'ttest-paired':
      return <TTestPairedFormula />;
    case 'anova':
      return <AnovaFormula />;
    case 'anova-two-way':
      return <AnovaTwoWayFormula />;
    case 'correlation':
      return <CorrelationFormula />;
    case 'correlation-difference':
      return <CorrelationDiffFormula />;
    case 'chi-square-gof':
      return <ChiSquareGofFormula />;
    case 'chi-square-contingency':
      return <ChiSquareContingencyFormula />;
    case 'proportion-test':
      return <ProportionTestFormula />;
    case 'proportion-difference':
      return <ProportionDiffFormula />;
    case 'sign-test':
      return <SignTestFormula />;
    case 'linear-regression':
      return <LinearRegressionFormula />;
    case 'multiple-regression':
      return <MultipleRegressionFormula />;
    case 'set-correlation':
      return <SetCorrelationFormula />;
    case 'multivariate':
      return <MultivariateFormula />;
    default:
      return null;
  }
}
