
export type StatisticalTest = 
  | "ttest-one-sample"
  | "ttest-two-sample" 
  | "ttest-paired"
  | "anova"
  | "anova-two-way"
  | "correlation"
  | "correlation-difference"
  | "chi-square"
  | "chi-square-gof"
  | "chi-square-contingency"
  | "proportion-test"
  | "proportion-difference"
  | "sign-test"
  | "linear-regression"
  | "multiple-regression"
  | "set-correlation"
  | "multivariate";

export type PowerParameters = {
  test: StatisticalTest;
  sampleSize: number | null;
  effectSize: number | null;
  significanceLevel: number | null;
  power: number | null;
  // Additional parameters for specific tests
  groups?: number;
  predictors?: number;
  responseVariables?: number;
  observations?: number;
  correlation?: number;
  tailType?: "one" | "two";
};

export type EffectSizeCategory = "small" | "medium" | "large";

export type TestEffectSizeMap = {
  [key in StatisticalTest]: {
    small: number;
    medium: number;
    large: number;
    label: string;
  };
};

// Configuration for test-specific parameters
export type TestConfig = {
  name: string;
  description: string;
  parameters: Array<keyof Omit<PowerParameters, "test">>;
  additionalControls?: {
    groups?: boolean;
    predictors?: boolean;
    responseVariables?: boolean;
    observations?: boolean;
    correlation?: boolean;
    tailType?: boolean;
  };
  defaultValues?: Partial<PowerParameters>;
};

export type TestConfigMap = {
  [key in StatisticalTest]: TestConfig;
};
