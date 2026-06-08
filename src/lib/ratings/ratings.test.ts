import { describe, it, expect } from "vitest";
import { apaMatchScore, apaSkillLevel, apaPerformance } from "./apa8";
import { gameWinProbability, fargoPerformance } from "./fargo";
import type { MatchInput } from "./types";
import { apa9PPI, ppiToSkillLevel, apa9Performance } from "./apa9";

// Helper to build a match without typing every field each time.
function match(overrides: Partial<MatchInput>): MatchInput {
  return {
    system: "apa8",
    won: true,
    innings: null,
    safeties: null,
    games_won: null,
    fargo_won: null,
    fargo_lost: null,
    opponent_rating: null,
    points_earned: null,
    opp_safeties: null,
    ...overrides,
  };
}

describe("APA 8-ball", () => {
  it("scores one match as (innings - safeties) per game won", () => {
    // (7 - 1) / 3 = 2.0
    expect(
      apaMatchScore(match({ innings: 7, safeties: 1, games_won: 3 })),
    ).toBe(2);
  });

  it("maps average scores to the right skill level", () => {
    expect(apaSkillLevel(2.0)).toBe(7);
    expect(apaSkillLevel(2.5)).toBe(6);
    expect(apaSkillLevel(3.5)).toBe(5);
    expect(apaSkillLevel(8.0)).toBe(2);
  });

  it("averages match scores over the sample", () => {
    const result = apaPerformance([
      match({ innings: 6, safeties: 0, games_won: 3 }), // 2.0
      match({ innings: 9, safeties: 0, games_won: 3 }), // 3.0
    ]);
    expect(result?.avgScore).toBe(2.5);
    expect(result?.skillLevel).toBe(6);
    expect(result?.sampleSize).toBe(2);
  });
});

describe("FargoRate", () => {
  it("gives a 50/50 game between equal players", () => {
    expect(gameWinProbability(500, 500)).toBe(0.5);
  });

  it("gives a 2-to-1 edge for a 100-point gap", () => {
    expect(gameWinProbability(600, 500)).toBeCloseTo(0.667, 2);
  });

  it("rates an even split against 500s as ~500", () => {
    const result = fargoPerformance([
      match({
        system: "fargo",
        fargo_won: 5,
        fargo_lost: 5,
        opponent_rating: 500,
      }),
    ]);
    expect(result?.rating).toBe(500);
  });

  it("rates winning 2 of 3 vs a 350 as ~450", () => {
    const result = fargoPerformance([
      match({
        system: "fargo",
        fargo_won: 2,
        fargo_lost: 1,
        opponent_rating: 350,
      }),
    ]);
    expect(result?.rating).toBe(450);
  });

  it("ignores matches from the other system", () => {
    const result = fargoPerformance([
      match({ system: "apa8", innings: 5 }), // should be skipped
      match({
        system: "fargo",
        fargo_won: 5,
        fargo_lost: 5,
        opponent_rating: 500,
      }),
    ]);
    expect(result?.rating).toBe(500);
  });
});

describe("APA 9-ball", () => {
  it("computes points per inning", () => {
    // 30 points / 5 innings = 6.0 PPI
    expect(
      apa9PPI(match({ system: "apa9", points_earned: 30, innings: 5 })),
    ).toBe(6);
  });

  it("maps PPI to the right band", () => {
    expect(ppiToSkillLevel(3.0)).toBe(5);
    expect(ppiToSkillLevel(3.9)).toBe(7);
    expect(ppiToSkillLevel(1.0)).toBe(1);
  });

  it("stays near the anchor on a tiny sample", () => {
    // One strong game (5.0 PPI → SL9 raw) but anchored at SL4.
    // w = (1/10)*0.7 = 0.07, so blended ≈ 4*0.93 + 9*0.07 = 4.07 → SL4
    const r = apa9Performance(
      [match({ system: "apa9", points_earned: 25, innings: 5 })],
      4,
    );
    expect(r?.skillLevel).toBe(4);
  });

  it("moves toward computed level with a full window", () => {
    // 10 games all at 3.8 PPI (SL7 raw), anchored at SL5.
    // w = 0.7, blended = 5*0.3 + 7*0.7 = 6.4 → SL6
    const games = Array.from({ length: 10 }, () =>
      match({ system: "apa9", points_earned: 38, innings: 10 }),
    );
    const r = apa9Performance(games, 5);
    expect(r?.skillLevel).toBe(6);
  });
});
