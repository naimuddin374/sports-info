import { LIVESCORE_URLS, TransformerFactory } from './TransformerFactory';
import { readFileSync } from 'fs';
import { testDataFor, testDataName } from '../../../test/utils';

describe('Transformers', () => {
  const factory: TransformerFactory = new TransformerFactory();

  const transformers = factory.allTransformers();

  Object.keys(factory.allTransformers()).forEach((key: LIVESCORE_URLS) => {
    it('transform ' + key, () => {
      const input = testDataFor(key);
      const output = JSON.parse(
        readFileSync('testdata/transformed/' + testDataName(key)).toString(),
      );
      transformers[key].MANGLE_ID_FIELDS = []; // Disable ID mapping to simplify test data
      transformers[key].MANGLE_ID = false;
      const result = transformers[key].processData(input);
      expect(result[0]).toStrictEqual(output);
    });
  });
});
