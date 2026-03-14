/**
 * Unit tests for CredibilityGauge label mapping.
 *
 * Verifies that the gauge displays confidence-level labels ("High confidence",
 * "Medium confidence", "Low confidence") rather than verdict words
 * ("Credible", "Uncertain", "Unreliable") so the score is not mistaken
 * for a binary truth verdict.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CredibilityGauge from "@/components/CredibilityGauge";

describe("CredibilityGauge – label mapping (size=lg)", () => {
  it('shows "High confidence" for score >= 70', () => {
    render(<CredibilityGauge score={70} label="Overall" size="lg" />);
    expect(screen.getByText("High confidence")).toBeTruthy();
  });

  it('shows "High confidence" for score 100', () => {
    render(<CredibilityGauge score={100} label="Overall" size="lg" />);
    expect(screen.getByText("High confidence")).toBeTruthy();
  });

  it('shows "Medium confidence" for score 40–69', () => {
    render(<CredibilityGauge score={40} label="Claims" size="lg" />);
    expect(screen.getByText("Medium confidence")).toBeTruthy();
  });

  it('shows "Medium confidence" for score 69', () => {
    render(<CredibilityGauge score={69} label="Claims" size="lg" />);
    expect(screen.getByText("Medium confidence")).toBeTruthy();
  });

  it('shows "Low confidence" for score < 40', () => {
    render(<CredibilityGauge score={39} label="Source" size="lg" />);
    expect(screen.getByText("Low confidence")).toBeTruthy();
  });

  it('shows "Low confidence" for score 0', () => {
    render(<CredibilityGauge score={0} label="Source" size="lg" />);
    expect(screen.getByText("Low confidence")).toBeTruthy();
  });

  it('does NOT display the word "Credible"', () => {
    render(<CredibilityGauge score={80} label="Overall" size="lg" />);
    expect(screen.queryByText("Credible")).toBeNull();
  });

  it('does NOT display the word "Verified" inside the gauge', () => {
    render(<CredibilityGauge score={95} label="Overall" size="lg" />);
    expect(screen.queryByText("Verified")).toBeNull();
  });

  it("shows the numeric score value", () => {
    render(<CredibilityGauge score={82} label="Overall" size="lg" />);
    expect(screen.getByText("82")).toBeTruthy();
  });

  it("shows the label prop as caption", () => {
    render(<CredibilityGauge score={50} label="Source Quality" size="lg" />);
    expect(screen.getByText("Source Quality")).toBeTruthy();
  });
});

describe("CredibilityGauge – size=sm (no inner label rendered)", () => {
  it("does not render the confidence label text in small mode", () => {
    render(<CredibilityGauge score={80} label="Claims" size="sm" />);
    // In sm mode the inner label span is not rendered
    expect(screen.queryByText("High confidence")).toBeNull();
    expect(screen.queryByText("Credible")).toBeNull();
  });
});
