export type Category = "wash" | "bleach" | "dry" | "iron" | "dry_clean";

export interface Rules {
    allow?: string[];
    forbid?: string[];
    condition?: string[];
}

export interface LaundrySymbol {
    id: string;
    category: Category;
    label: string;
    rules: Rules;
}

export interface EvaluationResult {
    summary: string;
    allow: string[];
    forbid: string[];
    warnings: string[];
}

/**
 * Rules Engine for Laundry Care Symbol Decoder.
 * Follows the "most restrictive wins" principle.
 */
export function evaluateSymbols(selectedSymbols: LaundrySymbol[]): EvaluationResult {
    if (selectedSymbols.length === 0) {
        return {
            summary: "No symbols selected. Please select symbols from your garment's care label.",
            allow: [],
            forbid: [],
            warnings: []
        };
    }

    const allowedSet = new Set<string>();
    const forbiddenSet = new Set<string>();
    const conditionsSet = new Set<string>();

    selectedSymbols.forEach(symbol => {
        symbol.rules.allow?.forEach(a => allowedSet.add(a));
        symbol.rules.forbid?.forEach(f => forbiddenSet.add(f));
        symbol.rules.condition?.forEach(c => conditionsSet.add(c));
    });

    // Most restrictive wins: items in forbid override items in allow
    // For simplicity in this version, we display all collected rules but filter allow by forbid if they overlap directly.
    // In a more complex engine, we'd map "Machine wash" to "Wash" etc.

    const finalAllow = Array.from(allowedSet).filter(a => !forbiddenSet.has(a));
    const finalForbid = Array.from(forbiddenSet);
    const finalWarnings = Array.from(conditionsSet);

    let summary = "Based on your selection:";
    if (finalForbid.length > 0) {
        summary = "Caution: Some actions are forbidden for this garment.";
    } else if (finalAllow.length > 0) {
        summary = "Care instructions generated successfully.";
    }

    return {
        summary,
        allow: finalAllow,
        forbid: finalForbid,
        warnings: finalWarnings
    };
}
