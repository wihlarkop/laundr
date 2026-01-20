import { describe, it, expect } from 'vitest';
import { evaluateSymbols, type LaundrySymbol } from './engine';

const mockSymbols: LaundrySymbol[] = [
    {
        id: 'wash-normal',
        category: 'wash',
        label: { en: 'Normal Wash', id: 'Cuci Normal' },
        rules: {
            allow: { en: ['Machine wash'], id: ['Cuci mesin'] }
        }
    },
    {
        id: 'no-bleach',
        category: 'bleach',
        label: { en: 'No Bleach', id: 'Tanpa Pemutih' },
        rules: {
            forbid: { en: ['Bleaching'], id: ['Pemutihan'] }
        }
    },
    {
        id: 'wash-delicate',
        category: 'wash',
        label: { en: 'Delicate', id: 'Halus' },
        rules: {
            allow: { en: ['Machine wash'], id: ['Cuci mesin'] },
            condition: { en: ['Gentle cycle'], id: ['Siklus lembut'] }
        }
    }
];

describe('Laundry Rule Engine', () => {
    it('should return empty results if no symbols are selected', () => {
        const result = evaluateSymbols([], 'en');
        expect(result.allow).toHaveLength(0);
        expect(result.forbid).toHaveLength(0);
        expect(result.summary).toBe("");
    });

    it('should correctly identify allowed rules', () => {
        const result = evaluateSymbols([mockSymbols[0]], 'en');
        expect(result.allow).toContain('Machine wash');
        expect(result.summary).toBe('results.summary.success');
    });

    it('should correctly identify forbidden rules', () => {
        const result = evaluateSymbols([mockSymbols[1]], 'en');
        expect(result.forbid).toContain('Bleaching');
        expect(result.summary).toBe('results.summary.caution');
    });

    it('should prioritize forbidden rules over allowed rules (Conflict Resolution)', () => {
        // Mock a conflict: one symbol says "allow bleach", another says "forbid bleach"
        const conflictMock: LaundrySymbol[] = [
            {
                id: 'allow-x',
                category: 'wash',
                label: { en: 'Allow', id: 'Boleh' },
                rules: { allow: { en: ['Bleaching'], id: ['Boleh'] } }
            },
            {
                id: 'forbid-x',
                category: 'wash',
                label: { en: 'Forbid', id: 'Jangan' },
                rules: { forbid: { en: ['Bleaching'], id: ['Jangan'] } }
            }
        ];

        const result = evaluateSymbols(conflictMock, 'en');
        expect(result.forbid).toContain('Bleaching');
        expect(result.allow).not.toContain('Bleaching');
    });

    it('should support different languages (Indonesian)', () => {
        const result = evaluateSymbols([mockSymbols[0]], 'id');
        expect(result.allow).toContain('Cuci mesin');
    });

    it('should collect warnings (conditions)', () => {
        const result = evaluateSymbols([mockSymbols[2]], 'en');
        expect(result.warnings).toContain('Gentle cycle');
    });
});
