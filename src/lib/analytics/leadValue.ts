import type { EnquiryRoute } from "@/lib/enquiry";

/**
 * What a lead is worth to the ad platforms, in EUR.
 *
 * Google Ads and Meta both bid toward conversion value once enough of it exists, so a
 * "€40k+ project" enquiry should not count the same as a "just saying hello". These
 * are the midpoints of the budget bands in src/lib/enquiry.ts — deliberately rough,
 * relative weights rather than a revenue forecast. Tune them here once real close
 * rates exist; this file is the only place the numbers live.
 */
const BUDGET_VALUE: Record<string, number> = {
  under5k: 2500,
  from5to15k: 10000,
  from15to40k: 27500,
  over40k: 50000,
  undecided: 5000,
};

/** Routes that do not ask for a budget. */
const ROUTE_VALUE: Record<EnquiryRoute, number> = {
  project: 5000,
  hiring: 10000,
  question: 250,
  hello: 50,
};

export function leadValue(route: EnquiryRoute, budget?: string): number {
  if (route === "project" && budget && budget in BUDGET_VALUE) return BUDGET_VALUE[budget];
  return ROUTE_VALUE[route];
}
