import * as Pain from './pain';

describe('pain', () => {
    test('basic', () => {
        const pain = new Pain.PainMessages();

        pain.add('shrug[s] off the attack.');
        pain.add('grunt[s] with pain.');
        pain.add('cr[ies|y] out in pain.');
        pain.add('scream[s] in pain.');
        pain.add('scream[s] in agony.');
        pain.add('writhe[s] in agony.');
        pain.add('cr[ies|y] out feebly.');

        expect(pain.get(0, true)).toEqual('shrugs off the attack.');
        expect(pain.get(0, false)).toEqual('shrug off the attack.');

        expect(pain.get(2 / 7, true)).toEqual('cries out in pain.');
        expect(pain.get(2 / 7, false)).toEqual('cry out in pain.');
    });
});
