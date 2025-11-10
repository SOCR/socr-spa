export type StatisticalTest = 
  "ttest-one-sample" | 
  "ttest-two-sample" | 
  "ttest-paired" | 
  "anova" | 
  "anova-two-way" | 
  "correlation" |
  "correlation-difference" |
  "proportion-test" |
  "sign-test" |
  "proportion-difference" |
  "chi-square-gof" |
  "chi-square-contingency" |
  "linear-regression" |
  "multiple-regression" |
  "set-correlation" |
  "multivariate" |
  "sem" |
  "mmrm";  // Mixed-Model Repeated Measures

export interface PowerParameters {
  test: StatisticalTest;
  sampleSize: number | null;
  effectSize: number | null;
  significanceLevel: number | null;
  power: number | null;
  tailType?: "one" | "two";
  groups?: number | null;
  observations?: number | null;
  correlation?: number | null;
  predictors?: number | null;
  responseVariables?: number | null;
  degreesOfFreedom?: number | null; // Added for SEM
  nullRmsea?: number | null; // Added for SEM close-fit testing
  timePoints?: number | null; // Number of measurement occasions for MMRM
  dropoutRate?: number | null; // Expected dropout rate for MMRM
  withinCorrelation?: number | null; // Correlation between repeated measures for MMRM
}

export interface TestConfig {
  name: string;
  description: string;
  parameters: Array<keyof Omit<PowerParameters, "test">>;
  additionalControls?: {
    tailType?: boolean;
    groups?: boolean;
    observations?: boolean;
    correlation?: boolean;
    predictors?: boolean;
    responseVariables?: boolean;
    degreesOfFreedom?: boolean;
    timePoints?: boolean;
    dropoutRate?: boolean;
    withinCorrelation?: boolean;
  };
  defaultValues?: Partial<PowerParameters>;
}

export interface TestConfigMap {
  [key: string]: TestConfig;
}

export interface EffectSizeConfig {
  small: number;
  medium: number;
  large: number;
  label: string;
}

export interface EffectSizeMap {
  [key: string]: EffectSizeConfig;
}
