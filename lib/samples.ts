export type Sample = { text: string; hasPanel: boolean; label: string };

export const SAMPLES: Sample[] = [
  { label: "Steroid cream",   text: "Aqua, Glycerin, Clobetasol Propionate 0.05%, Cetyl Alcohol", hasPanel: true },
  { label: "Mercury cream",   text: "Aqua, Mercury, Glycerin", hasPanel: true },
  { label: "Prescribed tube", text: "Clobetasol Propionate 0.05%", hasPanel: true },
  { label: "Unlabelled jar",  text: "", hasPanel: false },
  { label: "Clean label",     text: "Aqua, Glycerin, Niacinamide, Sodium Hyaluronate", hasPanel: true },
  { label: "Triple combo",    text: "Hydroquinone 4%, Tretinoin 0.025%, Fluocinolone acetonide 0.01%", hasPanel: true },
  { label: "OCR typo",        text: "Aqua, Clobetasoi Propionate, Glycerin", hasPanel: true },
];

export const EVAL_CASES = [
  { i: 0, name: "Steroid cream",   prescribed: "no",  expected: "RED"   },
  { i: 1, name: "Mercury cream",   prescribed: "no",  expected: "RED"   },
  { i: 2, name: "Prescribed tube", prescribed: "yes", expected: "RED"   },
  { i: 3, name: "Unlabelled jar",  prescribed: "no",  expected: "AMBER" },
  { i: 4, name: "Clean label",     prescribed: "no",  expected: "GREEN" },
  { i: 5, name: "Triple combo",    prescribed: "no",  expected: "RED"   },
  { i: 6, name: "OCR typo",        prescribed: "no",  expected: "RED", expectReview: true },
] as const;
