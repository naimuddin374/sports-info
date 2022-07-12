import { BaseTransformer } from './BaseTransformer';

describe('BaseTransformer', () => {
  let xformer: BaseTransformer;

  beforeEach(async () => {
    xformer = new BaseTransformer();
    xformer.ID_PATH = 'test';
    xformer.MANGLE_ID = false;
  });

  it('should flatten entity lookup', () => {
    const data = xformer.processData({
      DATA: [
        {
          test: 'test',
        },
        {
          test: 'test2',
        },
      ],
    });
    expect(data.length).toBe(2);
  });

  it('should flatten custom entity lookup', () => {
    xformer.ENTITY_PATH = 'DATA.SPORTS';
    const data = xformer.processData({
      DATA: {
        SPORTS: [
          {
            test: 'test',
          },
          {
            test: 'test2',
          },
        ],
      },
    });
    expect(data.length).toBe(2);
  });

  it('should mangle base id', () => {
    xformer.MANGLE_ID_FIELDS = [];
    xformer.MANGLE_ID = true;
    const data = xformer.processData({
      DATA: [
        {
          test: 'te2st',
        },
        {
          test: 'test2',
        },
      ],
    });
    expect(data[0].id).toBe('u1lwu');
    expect(data[0].external_id).toBe('te2st');
  });

  it('should mangle ids', () => {
    xformer.MANGLE_ID_FIELDS = ['test'];
    xformer.MANGLE_ID = true;
    const data = xformer.processData({
      DATA: [
        {
          test: 'te2st',
        },
        {
          test: 'test2',
        },
      ],
    });
    expect(data[0].data.test).toBe('u1lwu');
  });

  it('should mangle nested ids', () => {
    xformer.MANGLE_ID_FIELDS = ['test.boo'];
    xformer.MANGLE_ID = true;
    const data = xformer.processData({
      DATA: [
        {
          test: {
            boo: 'te2st',
          },
        },
        {
          test: {
            boo: 'test',
          },
        },
      ],
    });
    expect(data[0].data.test.boo).toBe('u1lwu');
  });

  it('should mangle array ids', () => {
    xformer.MANGLE_ID_FIELDS = ['test'];
    xformer.MANGLE_ID = true;
    const data = xformer.processData({
      DATA: [
        {
          test: ['te2st', 'te2st'],
        },
        {
          test: ['test', 'test'],
        },
      ],
    });
    expect(data[0].data.test).toStrictEqual(['u1lwu', 'u1lwu']);
  });

  it('should mangle array of ids', () => {
    xformer.MANGLE_ID_FIELDS = ['test'];
    xformer.MANGLE_ID = true;
    xformer.COLLECT = true;
    const data = xformer.processData({
      DATA: [
        {
          test: 'te2st',
        },
        {
          test: 'te2st',
        },
      ],
    });
    console.log(data);
    expect(data[0].data[0].test).toStrictEqual('u1lwu');
  });

  it('should mangle nested array ids', () => {
    xformer.MANGLE_ID_FIELDS = ['test.foo'];
    xformer.MANGLE_ID = true;
    const data = xformer.processData({
      DATA: [
        {
          test: [
            {
              foo: 'te2st',
            },
            {
              foo: 'te2st',
            },
          ],
        },
        {
          test: [
            {
              foo: 'test',
            },
            {
              foo: 'test',
            },
          ],
        },
      ],
    });
    expect(data[0].data.test[0].foo).toBe('u1lwu');
    expect(data[0].data.test[1].foo).toBe('u1lwu');
  });

  it('should set the external_id', () => {
    xformer.ENTITY_PATH = 'DATA.SPORTS';
    const data = xformer.processData({
      DATA: {
        SPORTS: [
          {
            test: 'test',
          },
          {
            test: 'test2',
          },
        ],
      },
    });
    expect(data[0].external_id).toBe(data[0].data.test);
  });

  it('should respect id override', () => {
    xformer.ENTITY_PATH = 'DATA.SPORTS';
    const data = xformer.processData(
      {
        DATA: {
          SPORTS: [
            {
              test: 'test',
            },
            {
              test: 'test2',
            },
          ],
        },
      },
      'TEST_OVERRIDE',
    );
    expect(data[0].external_id).toBe('TEST_OVERRIDE');
    expect(data[0].id).toBe('TEST_OVERRIDE');
  });
  it('should singularize data', () => {
    xformer.ENTITY_PATH = 'DATA.SPORTS';
    xformer.COLLECT = true;
    const data = xformer.processData(
      {
        DATA: {
          SPORTS: [
            {
              test: 'test',
            },
            {
              test: 'test2',
            },
          ],
        },
      },
      'TESTOVERRIDE',
    );
    expect(data.length).toBe(1);
  });
});
