
import { TestConfigMap } from "@/types/power-analysis";

export const TEST_CONFIGURATIONS: TestConfigMap = {
  "ttest-one-sample": {
    name: "One-sample t-test",
    description: "Tests if a sample mean differs from a specified value",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "ttest-two-sample": {
    name: "Two-sample t-test",
    description: "Tests if two independent sample means differ",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "ttest-paired": {
    name: "Paired t-test",
    description: "Tests if means of paired observations differ",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true,
      correlation: true
    },
    defaultValues: {
      tailType: "two",
      correlation: 0.5
    }
  },
  "anova": {
    name: "One-way ANOVA",
    description: "Tests if means of three or more groups differ",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true
    },
    defaultValues: {
      groups: 3
    }
  },
  "anova-two-way": {
    name: "Two-way ANOVA",
    description: "Tests main effects and interactions between two factors",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true,
      observations: true
    },
    defaultValues: {
      groups: 2,
      observations: 2
    }
  },
  "correlation": {
    name: "Correlation",
    description: "Tests if correlation coefficient differs from zero",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "correlation-difference": {
    name: "Differences between Correlations",
    description: "Tests if two correlation coefficients differ",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "chi-square": {
    name: "Chi-square Test",
    description: "General chi-square test",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true
    },
    defaultValues: {
      groups: 2
    }
  },
  "chi-square-gof": {
    name: "Chi-square Goodness of Fit",
    description: "Tests if observed frequencies match expected frequencies",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true
    },
    defaultValues: {
      groups: 3
    }
  },
  "chi-square-contingency": {
    name: "Chi-square Contingency Tables",
    description: "Tests association between categorical variables",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true,
      observations: true
    },
    defaultValues: {
      groups: 2,
      observations: 2
    }
  },
  "proportion-test": {
    name: "Proportion Test (0.50)",
    description: "Tests if a proportion equals 0.50",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "proportion-difference": {
    name: "Differences between Proportions",
    description: "Tests if two proportions differ",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "sign-test": {
    name: "Sign Test",
    description: "Tests if the median equals a specified value",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "linear-regression": {
    name: "Simple Linear Regression",
    description: "Tests if regression slope differs from zero",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      tailType: true
    },
    defaultValues: {
      tailType: "two"
    }
  },
  "multiple-regression": {
    name: "Multiple Regression",
    description: "Tests if multiple regression coefficients differ from zero",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      predictors: true
    },
    defaultValues: {
      predictors: 3
    }
  },
  "set-correlation": {
    name: "Set Correlation",
    description: "Tests correlation between sets of variables",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      predictors: true,
      responseVariables: true
    },
    defaultValues: {
      predictors: 3,
      responseVariables: 2
    }
  },
  "multivariate": {
    name: "Multivariate Methods",
    description: "Tests effects in multivariate designs",
    parameters: ["sampleSize", "effectSize", "significanceLevel", "power"],
    additionalControls: {
      groups: true,
      responseVariables: true
    },
    defaultValues: {
      groups: 2,
      responseVariables: 2
    }
  }
};
