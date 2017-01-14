@manual
Feature: Triangle Calculation

  The possible triangle types are:

  - Scalene:     all side lengths are different
  - Isosceles:   two side lengths equal
  - Equilateral: all side lengths are equal

  Side lengths determine if a valid triangle is formed.

  A "right" triangle has one angle which is 90 degrees.
  An "impossible" triangle is one in which the sum of two sides are not greater than the third.
  An "invalid" triangle is one that is not a triangle.

  @named
  Scenario: Scalene
    Given the length values 10, 8, 3
    When  the triangle is calculated
    Then  the triangle type is "scalene"

  @named
  Scenario: Isosceles
    Given the length values 2, 2, 1
    When  the triangle is calculated
    Then  the triangle type is "isosceles"

  @named
  Scenario: Equilateral
    Given the length values 2, 2, 2
    When  the triangle is calculated
    Then  the triangle type is "equilateral"

  @angle @named
  Scenario: Right
    Given the length values 3, 4, 5
    When  the triangle is calculated
    Then  the triangle type is "right"

  @bad
  Scenario: Impossible
    Given the length values 4, 5, 9
    When  the triangle is calculated
    Then  the triangle type is "impossible"

  @bad
  Scenario: Impossible
    Given the length values 3, 2, 1
    When  the triangle is calculated
    Then  the triangle type is "impossible"

  @bad
  Scenario: Invalid
    Given the length values 2, 0, 2
    When  the triangle is calculated
    Then  the triangle type is "invalid"
