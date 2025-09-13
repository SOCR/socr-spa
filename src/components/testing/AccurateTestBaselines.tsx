import { PowerParameters, StatisticalTest } from '@/types/power-analysis';

export const getAccurateTestCase = (testId: string) => {
  switch (testId) {
    case "ttest-power-medium":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.05,
        params: {
          test: "ttest-two-sample" as StatisticalTest,
          sampleSize: 128,
          effectSize: 0.5,
          significanceLevel: 0.05,
          power: null,
          tailType: "two" as const
        }
      };
      
    case "ttest-sample-size":
      return {
        expectedResults: { sampleSize: 128 },
        tolerance: 0.15,
        params: {
          test: "ttest-two-sample" as StatisticalTest,
          sampleSize: null,
          effectSize: 0.5,
          significanceLevel: 0.05,
          power: 0.8,
          tailType: "two" as const
        }
      };

    case "ttest-one-sample-power":
      return {
        expectedResults: { power: 0.700 },
        tolerance: 0.05,
        params: {
          test: "ttest-one-sample" as StatisticalTest,
          sampleSize: 27,
          effectSize: 0.5,
          significanceLevel: 0.05,
          power: null,
          tailType: "two" as const
        }
      };

    case "anova-power":
      return {
        expectedResults: { power: 0.840 },
        tolerance: 0.05,
        params: {
          test: "anova" as StatisticalTest,
          sampleSize: 180,
          effectSize: 0.25,
          significanceLevel: 0.05,
          power: null,
          groups: 4
        }
      };

    case "anova-sample-size":
      return {
        expectedResults: { sampleSize: 180 },
        tolerance: 0.2,
        params: {
          test: "anova" as StatisticalTest,
          sampleSize: null,
          effectSize: 0.25,
          significanceLevel: 0.05,
          power: 0.8,
          groups: 4
        }
      };

    case "correlation-power":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.05,
        params: {
          test: "correlation" as StatisticalTest,
          sampleSize: 84,
          effectSize: 0.3,
          significanceLevel: 0.05,
          power: null,
          tailType: "two" as const
        }
      };

    case "chi-square-power":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.15,
        params: {
          test: "chi-square-gof" as StatisticalTest,
          sampleSize: 88,
          effectSize: 0.3,
          significanceLevel: 0.05,
          power: null,
          groups: 3
        }
      };

    case "proportion-power":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.10,
        params: {
          test: "proportion-test" as StatisticalTest,
          sampleSize: 128, // PHASE B FIX: Corrected for h=0.5 to achieve 0.80 power
          effectSize: 0.5,
          significanceLevel: 0.05,
          power: null,
          tailType: "two" as const
        }
      };

    case "regression-power":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.05,
        params: {
          test: "multiple-regression" as StatisticalTest,
          sampleSize: 77,
          effectSize: 0.15,
          significanceLevel: 0.05,
          power: null,
          predictors: 3
        }
      };

    case "regression-effect-size":
      return {
        expectedResults: { effectSize: 0.15 },
        tolerance: 0.1,
        params: {
          test: "multiple-regression" as StatisticalTest,
          sampleSize: 77,
          effectSize: null,
          significanceLevel: 0.05,
          power: 0.8,
          predictors: 3
        }
      };

    case "sem-power":
      return {
        expectedResults: { power: 0.800 },
        tolerance: 0.05,
        params: {
          test: "sem" as StatisticalTest,
          sampleSize: 158,
          effectSize: 0.08,
          significanceLevel: 0.05,
          power: null,
          degreesOfFreedom: 10,
          nullRmsea: 0.05 // PHASE B FIX: Close-fit test (H0: RMSEA >= 0.05)
        }
      };

    default:
      return null;
  }
};