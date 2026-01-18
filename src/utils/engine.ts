export type Category = "wash" | "bleach" | "dry" | "iron" | "dry_clean";

export interface Rules {
    allow?: { [lang: string]: string[] };
    forbid?: { [lang: string]: string[] };
    condition?: { [lang: string]: string[] };
}

export interface LaundrySymbol {
    id: string;
    category: Category;
    label: { [lang: string]: string };
    description?: { [lang: string]: string };
    tip?: { [lang: string]: string };
    rules: Rules;
}

export interface EvaluationResult {
    summary: string;
    allow: string[];
    forbid: string[];
    warnings: string[];
}

export function evaluateSymbols(selectedSymbols: LaundrySymbol[], lang: string = "en"): EvaluationResult {
    if (selectedSymbols.length === 0) {
        return {
            summary: "", // Will be handled by UI translation
            allow: [],
            forbid: [],
            warnings: []
        };
    }

    const allowedSet = new Set<string>();
    const forbiddenSet = new Set<string>();
    const conditionsSet = new Set<string>();

    selectedSymbols.forEach(symbol => {
        symbol.rules.allow?.[lang]?.forEach(a => allowedSet.add(a));
        symbol.rules.forbid?.[lang]?.forEach(f => forbiddenSet.add(f));
        symbol.rules.condition?.[lang]?.forEach(c => conditionsSet.add(c));
    });

    const finalAllow = Array.from(allowedSet).filter(a => !forbiddenSet.has(a));
    const finalForbid = Array.from(forbiddenSet);
    const finalWarnings = Array.from(conditionsSet);

    // Summary strings should probably be in ui.ts, but keeping logic here for now
    let summaryKey = "results.summary.default";
    if (finalForbid.length > 0) {
        summaryKey = "results.summary.caution";
    } else if (finalAllow.length > 0) {
        summaryKey = "results.summary.success";
    }

    return {
        summary: summaryKey, // UI will translate this key
        allow: finalAllow,
        forbid: finalForbid,
        warnings: finalWarnings
    };
}
