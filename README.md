# SOCR Statistical Power Analyzer

![](https://github.com/SOCR/socr-spa/blob/main/SOCR_StatisticalPowerAnalyzer.png?raw=true)

This [SOCR project](https://socr.umich.edu/) supports interactive calculation of statistical power, sample size, effect size, and significance level. 

Table of contents
=================

<!--ts-->
   * [Table of contents](#table-of-contents)
   * [Disclaimer](#iisclaimer)
   * [Technical Details](#technical-details)
       1. [Five Key Components](#five-key-components)
       2. [Relationship Between Parameters](#relationship-between-parameters)
       3. [Statistical Tests and Effect Size Measures](#statistical-tests-and-effect-size-measures)
   * [Common Scenarios](#common-scenarios)
   * [Important Considerations](#important-considerations)
   * [Resources](#resources)
<!--te-->

Disclaimer
==========

This app is not FDA approved. It's intendend for demonstration, education, and research purposes only. Always consult with a statistician for complex study designs.

Technical Details
=================

Power analysis is a statistical approach that explicates the relations between multiple parameters that affect experimental designs. It helps researchers determine the sample size needed to detect an effect of a given size with a specified level of confidence.

Five Key Components
===================

    Statistical Test: The specific statistical inference method used to analyze your data (e.g., t-test, ANOVA, correlation).
    Sample Size: The number of observations in your study. Larger samples provide more statistical power but require more resources.
    Effect Size: How strong the expected effect is. Common measures include:
        Cohen's d (t-tests): 0.2 (small), 0.5 (medium), 0.8 (large)
        Cohen's f (ANOVA): 0.1 (small), 0.25 (medium), 0.4 (large)
        Cohen's r (correlation): 0.1 (small), 0.3 (medium), 0.5 (large)
        Cohen's w (chi-square): 0.1 (small), 0.3 (medium), 0.5 (large)
        Cohen's f² (regression): 0.02 (small), 0.15 (medium), 0.35 (large)
    Significance Level (α): The probability of Type I error (false positive) - finding an effect that isn't actually there. Commonly set at 0.05.
    Power (1-β): The probability of detecting a true effect (sensitivity). Equals 1 minus the probability of a Type II error (false negative). Power of 0.8 (80%) is often considered acceptable.

Relationship Between Parameters
===============================

These five parameters are interconnected. When you specify any four of them, you can calculate the fifth:

    Increasing sample size → increases power
    Larger effect sizes → increases power
    Stricter significance level (smaller α) → decreases power
    Higher required power → requires larger sample sizes

Statistical Tests and Effect Size Measures
==========================================

T-Tests

Cohen's d measures the standardized difference between two means: d = (Mean₁ - Mean₂) / Pooled Standard Deviation
ANOVA

Cohen's f is used for ANOVA: f = sqrt(η² / (1 - η²)) where η² (eta squared) is the proportion of variance explained.
Correlation

Cohen's r is the correlation coefficient itself.
Chi-Square Tests

Cohen's w represents the discrepancy between observed and expected proportions.
Linear Regression

Cohen's f² is calculated as R² / (1 - R²) where R² is the coefficient of determination.

Common Scenarios
================

    Sample Size Determination: When planning a study, researchers often want to know how many participants they need to detect an expected effect size with adequate power.
    Power Calculation: After a study is completed or with a fixed sample size, calculating the power to detect various effect sizes helps interpret results.
    Minimum Detectable Effect: For a fixed sample size and desired power, calculating the smallest effect size that can be reliably detected.

Important Considerations
========================

    Power analyses are based on statistical assumptions that should be carefully evaluated.
    Effect size estimates from previous studies may not be directly applicable to new research contexts.
    Practical significance (meaningful real-world impact) is distinct from statistical significance.
    Overpowered studies might detect trivially small effects with little practical importance.
    Underpowered studies risk failing to detect meaningful effects.

## References
 - [SOCR](https://socr.umich.edu),  [SOCR HTML5 Webapps](https://socr.umich.edu/HTML5/), [SOCR GAIMs](https://socr.umich.edu/GAIM/)
 - [Live SOCR Statistical Power Analyzer Webapp]([https://ibc-broad.gray-rain.com/](https://socr-spa.gray-rain.com/))
 - [Source code on GitHub](https://github.com/SOCR/socr-spa)
