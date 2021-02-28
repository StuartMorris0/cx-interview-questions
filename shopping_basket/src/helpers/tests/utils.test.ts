import { formatNumber } from '../utils';

describe('utils test', () => {
    it('format number returns correctly', () => {
        const test1 = 0.9993;
        expect(formatNumber(test1)).toBe(1);

        const test2 = 0.333333;
        expect(formatNumber(test2)).toBe(0.33);

        const test3 = 2099494.000004;
        expect(formatNumber(test3)).toBe(2099494.0);
    });
});
