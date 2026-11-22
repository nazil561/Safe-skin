export type Tier =
  | "RED_BANNED_TOXIC"
  | "RED_PRESCRIPTION_STEROID"
  | "AMBER_NOT_PERMITTED_COSMETIC"
  | "AMBER_UNLISTED"
  | "AMBER_CAUTION"
  | "GREEN_NO_FLAGS";

export type Prescribed = "yes" | "no" | "not_sure";

export type Flag = {
  name: string;
  category: Tier;
  matched_text: string;
  needs_review: boolean;
  note: string | null;
  text: string;
  badge: string | null;
  why: string | null;
  confidence: string;
  source: string | null;
};

export type CheckResult = {
  top: Tier;
  flags: Flag[];
  claims: string[];
};

export const TIER_LABELS: Record<Tier, string> = {
  RED_BANNED_TOXIC:            "RED · banned / toxic",
  RED_PRESCRIPTION_STEROID:    "RED · prescription steroid",
  AMBER_NOT_PERMITTED_COSMETIC:"AMBER · not permitted in cosmetics",
  AMBER_UNLISTED:              "AMBER · cannot verify",
  AMBER_CAUTION:               "AMBER · caution",
  GREEN_NO_FLAGS:              "GREEN · no flags",
};

export const TIER_REASONS: Record<Tier, string> = {
  RED_BANNED_TOXIC:            "Matches a substance banned in cosmetics under PS 3228-2017 (mercury).",
  RED_PRESCRIPTION_STEROID:    "Matches a prescription-only corticosteroid that must not appear in a cosmetic.",
  AMBER_NOT_PERMITTED_COSMETIC:"Matches an active not permitted in cosmetic products under PS 3228-2017.",
  AMBER_UNLISTED:              "The ingredient list is missing or unreadable, so the product cannot be verified.",
  AMBER_CAUTION:               "Matches a medicine-style active that needs medical supervision in skin products.",
  GREEN_NO_FLAGS:              "None of the current restricted/limited ingredient patterns matched the confirmed text.",
};

export const ALTERNATIVES: Record<string, string[]> = {
  "Mercury": [
    "Stop using this product immediately – mercury creams can cause kidney damage and skin darkening",
    "For uneven tone, look for niacinamide, vitamin C, azelaic acid or kojic acid instead",
    "Any cream that promises instant fairness without a full label is high risk",
  ],
  "Clobetasol propionate": [
    "Ask the pharmacist about a gentle steroid-free moisturiser for redness and itching",
    "For itch: pharmacy hydrocortisone 1% for a short, labelled skin patch – ask the pharmacist first",
    "Never swap a prescription steroid for another steroid cream without advice",
  ],
  "Betamethasone": [
    "Ask the pharmacist about fragrance-free barrier creams for irritation",
    "Do not continue another betamethasone product without a doctor’s advice",
  ],
  "Fluocinolone acetonide": [
    "Ask the pharmacist or dermatologist for a safe maintenance moisturiser while stopping",
    "Rotation to weaker steroids must be done under medical advice",
  ],
  "Hydroquinone": [
    "Ingredients like niacinamide 4–5%, azelaic acid and vitamin C are gentler tone-evening options",
    "Daily sunscreen SPF 30+ is the single most effective step against dark spots",
    "Prescription depigmenting products should only be used under medical supervision",
  ],
  "Tretinoin": [
    "Ask about retinyl palmitate or low-strength retinol for cosmetic use, or azelaic acid for acne",
    "Always pair with a gentle moisturiser and daily sunscreen",
    "Must not be used during pregnancy",
  ],
  "No ingredients listed / unverifiable": [
    "Buy products with a complete, printed ingredient list (INCI names) and a batch number",
    "Aim for registered products: check DRAP / PS 3228-2017 compliance claims on the pack",
    "Ask the pharmacy for fragrance-free, well-known brands instead of repackaged jars",
  ],
  "No restricted matches": [
    "No safer swap needed – keep using sunscreen and a gentle moisturiser",
    "Still avoid unlabelled jars and ‘instant fairness’ claims",
  ],
};

export function altFor(flag: Flag): string[] | null {
  const key = flag.name.replace(/^Possible match:\s*/, "");
  if (ALTERNATIVES[key]) return ALTERNATIVES[key];
  if (key.includes("Clobetasol")) return ALTERNATIVES["Clobetasol propionate"];
  return null;
}

export function stripClaimPhrases(t: string): string {
  return (t || "")
    .replace(/\b(?:no|without|zero)\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g, " ")
    .replace(/\bfree\s+of\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g, " ")
    .replace(/\bfree\s+from\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g, " ")
    .replace(/\b(?:mercury|hg|hydroquinone|steroid)s?[\s-]*free\b/g, " ")
    .replace(/\s+/g, " ");
}

export function findClaimPhrases(t: string): string[] {
  const out: string[] = [];
  const tests = [
    /\b(?:no|without|zero)\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g,
    /\bfree\s+of\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g,
    /\bfree\s+from\s+(?:mercury|hg|hydroquinone|steroid)s?\b/g,
    /\b(?:mercury|hg|hydroquinone|steroid)s?[\s-]*free\b/g,
  ];
  tests.forEach((re) => {
    (t.match(re) || []).forEach((m) => out.push(m.trim()));
  });
  return [...new Set(out)];
}

export function simpleCheck(rawText: string, hasPanel: boolean, prescribed: Prescribed): CheckResult {
  const claims = findClaimPhrases((rawText || "").toLowerCase());
  const t = stripClaimPhrases((rawText || "").toLowerCase());
  const flags: Flag[] = [];

  const add = (
    name: string, category: Tier, matched: string, review: boolean,
    note: string | null, cosmetic: string,
    prescText: string | null = null, notSureText: string | null = null,
    why: string | null = null, conf = "Exact match", src: string | null = null,
  ) => {
    let text = cosmetic;
    let badge: string | null = null;
    if (prescribed === "yes" && prescText) { text = prescText; badge = "Prescribed – follow your prescriber"; }
    else if (prescribed === "not_sure" && notSureText) { text = notSureText; }
    flags.push({ name, category, matched_text: matched, needs_review: review, note,
      text, badge, why, confidence: conf, source: src });
  };

  if (!hasPanel || !t.trim()) {
    add("No ingredients listed / unverifiable", "AMBER_UNLISTED", "", false, null,
      "We cannot verify the ingredients. Unlabelled creams may contain hidden steroids or mercury. Consider stopping and speaking to a pharmacist or dermatologist.",
      "Since a doctor gave you this, keep following their advice and ask what it contains. Do not stop prescribed treatment on your own.",
      "If this may have been prescribed, ask the prescriber or pharmacist before changing treatment.",
      "The “ingredient panel present” box was unticked or the text was empty, so no ingredient could be read.",
      "Not applicable", "Rule: missing or unreadable panel");
    return { flags, top: "AMBER_UNLISTED", claims };
  }

  if (/\bmercury\b/.test(t) || /\bhg\b/.test(t) || /\bmercurio\b/.test(t)) {
    add("Mercury", "RED_BANNED_TOXIC", "mercury", false, null,
      "This product lists mercury. PS 3228-2017 says mercury must not be added to skin creams. Stop applying it and speak to a pharmacist or dermatologist. Keep away from children. If pregnant, tell your doctor.",
      "This product lists mercury. Stop applying it. Tell the person who gave it to you and speak to a pharmacist. Do not stop any prescribed treatment without professional advice.",
      "This product lists mercury. Stop applying it and speak to a pharmacist or dermatologist.",
      "The word “mercury” (or Hg) was found in the confirmed text after removing claim phrases. Mercury is banned in cosmetics under PS 3228-2017.",
      "Exact match", "PS 3228-2017 – mercury banned in cosmetics (draft reading, pending professional review)");
  }

  if (/\bclobetasol\b/.test(t)) {
    add("Clobetasol propionate", "RED_PRESCRIPTION_STEROID", "clobetasol", false, null,
      "This cream lists clobetasol, a strong steroid that should not be in a cosmetic. Face use can cause redness, stinging or burning after stopping. Speak to a pharmacist or dermatologist about how to stop safely.",
      "Since a doctor prescribed this, follow their instructions. Do not stop or change it on your own. Ask them if you have concerns.",
      "If this may have been prescribed, contact the prescriber or pharmacist before changing treatment. Do not rely on this result alone.",
      "The word “clobetasol” was found in the confirmed text. It is a prescription-only steroid.",
      "Exact match", "Prescription-only topical corticosteroid (draft list; Rx-only in Pakistan)");
  }

  if (/clobetasoi/.test(t)) {
    add("Possible match: Clobetasol propionate", "RED_PRESCRIPTION_STEROID", "clobetasoi propionate", true,
      "The text reads “clobetasoi” – this looks like an OCR typo for clobetasol, flagged for your review.",
      "This cream appears to list clobetasol, a strong steroid that should not be in a cosmetic. Check the label yourself and correct the text if needed, then re-check.",
      "Since a doctor prescribed this, follow their instructions. Do not stop or change it on your own. Ask them if you have concerns.",
      "If this may have been prescribed, contact the prescriber or pharmacist before changing treatment. Do not rely on this result alone.",
      "Fuzzy match: “clobetasoi” is one character off from “clobetasol”, a prescription-only steroid. Shown as a possible match, not a certainty.",
      "Fuzzy (OCR typo)", "Prescription-only topical corticosteroid (draft list; Rx-only in Pakistan)");
  }

  if (/\bbetamethasone\b/.test(t)) {
    add("Betamethasone", "RED_PRESCRIPTION_STEROID", "betamethasone", false, null,
      "This product lists betamethasone, a steroid medicine. If used on the face, speak to a pharmacist or dermatologist about stopping safely.",
      "Since a doctor prescribed this, follow their instructions. Do not stop it on your own.",
      "Contact the prescriber or pharmacist to confirm.",
      "The word “betamethasone” was found in the confirmed text. It is a prescription steroid medicine.",
      "Exact match", "Prescription-only topical corticosteroid (draft list; Rx-only in Pakistan)");
  }

  if (/\bfluocinolone\b/.test(t)) {
    add("Fluocinolone acetonide", "RED_PRESCRIPTION_STEROID", "fluocinolone", false, null,
      "This product lists fluocinolone acetonide, a steroid medicine. Speak to a pharmacist or dermatologist.",
      "Since a doctor prescribed this, follow their instructions. Do not stop it on your own.",
      "Contact the prescriber or pharmacist.",
      "The word “fluocinolone” was found in the confirmed text. It is a prescription steroid medicine.",
      "Exact match", "Prescription-only topical corticosteroid (draft list; Rx-only in Pakistan)");
  }

  if (/\bhydroquinone\b/.test(t) || /\bhq\b/.test(t)) {
    const hqOnly = /\bhq\b/.test(t) && !/\bhydroquinone\b/.test(t);
    add("Hydroquinone", "AMBER_NOT_PERMITTED_COSMETIC", hqOnly ? "HQ" : "hydroquinone", hqOnly, null,
      "Hydroquinone should not be in cosmetic creams under PS 3228-2017. Long-term use can cause ochronosis (blue-black patches). Ask a pharmacist or dermatologist and use sun protection.",
      "Since a doctor prescribed this, follow their instructions. Hydroquinone can still cause ochronosis with long-term use. Do not stop prescribed treatment without professional advice.",
      "Contact the prescriber or pharmacist before continuing.",
      hqOnly
        ? "The abbreviation “HQ” was found. It commonly stands for hydroquinone, so this is flagged for review."
        : "The word “hydroquinone” was found in the confirmed text. It is not permitted in cosmetics under PS 3228-2017.",
      hqOnly ? "Abbreviation (HQ)" : "Exact match",
      "PS 3228-2017 – hydroquinone not permitted in cosmetics (draft reading, pending professional review)");
  }

  if (/\btretinoin\b/.test(t) || /\bvitamin a acid\b/.test(t)) {
    add("Tretinoin", "AMBER_CAUTION", "tretinoin", false, null,
      "This product lists tretinoin (a retinoid). It can cause dryness and sun sensitivity. Must not be used if pregnant or planning pregnancy. Use sunscreen.",
      "Since a doctor prescribed this, follow their instructions. Tretinoin must not be used during pregnancy – contact your prescriber if this applies.",
      "Contact the prescriber or pharmacist. Tretinoin must not be used in pregnancy.",
      "The word “tretinoin” was found in the confirmed text. It is a retinoid medicine requiring supervision.",
      "Exact match", "Retinoid medicine – requires medical supervision (draft)");
  }

  if (flags.length === 0) {
    add("No restricted matches", "GREEN_NO_FLAGS", "", false, null,
      "No restricted ingredients were matched from our current list. This is not a safety guarantee. Labels may omit ingredients. Always check the full label yourself.",
      null, null,
      "None of the current restricted/limited ingredient patterns matched the confirmed text. The rule list is short, so this is not proof of safety.",
      "Not applicable", "No rule matched");
  }

  const order: Tier[] = [
    "RED_BANNED_TOXIC", "RED_PRESCRIPTION_STEROID",
    "AMBER_NOT_PERMITTED_COSMETIC", "AMBER_UNLISTED", "AMBER_CAUTION",
    "GREEN_NO_FLAGS",
  ];
  flags.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  return { flags, top: flags[0].category, claims };
}

export function topClass(cat: Tier): "RED" | "AMBER" | "GREEN" {
  return cat.startsWith("RED") ? "RED" : cat.startsWith("AMBER") ? "AMBER" : "GREEN";
}
