import {
  LIVESCORE_URLS,
  TransformerFactory,
} from '../src/livescoreService/transformers/TransformerFactory';
import { readFileSync } from 'fs';

export function testDataName(key: LIVESCORE_URLS) {
  return key.replace(/\//g, '-') + '.json';
}
export function testDataFor(key: LIVESCORE_URLS) {
  return JSON.parse(readFileSync('testdata/' + testDataName(key)).toString());
}

export function transformedTestDataFor(key: LIVESCORE_URLS) {
  const data = testDataFor(key);
  const f = new TransformerFactory();
  const t = f.transformerForUrl(key);
  return t.processData(data, 'TESTID');
}
