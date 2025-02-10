import { isTwoEqualObjects } from './is-two-equal-objects';

describe('isTwoEqualObjects', () => {
  it('should validate the exact equality of two objects', () => {
    const objectA = {
      'd-block': true,
      relative: true,
      hello: 11,
    };

    const objectB = {
      'h-full': true,
      'w-full': true,
    };

    expect(isTwoEqualObjects(objectA, objectA)).toBe(true);
    expect(isTwoEqualObjects(objectB, objectB)).toBe(true);
    expect(isTwoEqualObjects(objectA, objectB)).toBe(false);

    expect(
      isTwoEqualObjects(objectA, {
        'd-block': true,
        relative: true,
        hello: 11,
      }),
    ).toBe(true);

    expect(
      isTwoEqualObjects(objectB, {
        'h-full': true,
        'w-full': true,
      }),
    ).toBe(true);
  });
});
