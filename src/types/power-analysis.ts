
export type StatisticalTest = 
  | "ttest-one-sample"
  | "ttest-two-sample" 
  | "ttest-paired"
  | "anova"
  | "correlation"
  | "chi-square"
  | "linear-regression";

export type PowerParameters = {
  test: StatisticalTest;
  sampleSize: number | null;
  effectSize: number | null;
  significanceLevel: number | null;
  power: number | null;
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
