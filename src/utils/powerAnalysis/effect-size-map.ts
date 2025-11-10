/**
 * Effect size configurations for different statistical tests
 * Based on Cohen's conventions and established statistical literature
 */

export const EFFECT_SIZE_MAP = {
  "ttest-one-sample": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "ttest-two-sample": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "ttest-paired": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "anova": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
  "anova-two-way": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
  "correlation": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "r"
  },
  "correlation-difference": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "r"
  },
  "chi-square-gof": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "w"
  },
  "chi-square-contingency": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "w"
  },
  "proportion-test": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's h"
  },
  "proportion-difference": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's h"
  },
  "sign-test": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "linear-regression": {
    small: 0.02,
    medium: 0.15,
    large: 0.35,
    label: "f²"
  },
  "multiple-regression": {
    small: 0.02,
    medium: 0.15,
    large: 0.35,
    label: "f²"
  },
  "set-correlation": {
    small: 0.02,
    medium: 0.13,
    large: 0.26,
    label: "f²"
  },
  "multivariate": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
  "sem": {
    small: 0.05,
    medium: 0.08,
    large: 0.1,
    label: "RMSEA"
  },
  "mmrm": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "δ (standardized difference)"
  }
};