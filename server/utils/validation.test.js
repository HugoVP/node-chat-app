const expect = require('expect');
const { isRealString } = require('./validation');

describe('validation', () => {
  it('should reject non-string values', () => {
    const validated = isRealString(434234);
    expect(validated).toBe(false);
  });

  it('should reject string with only spaces', () => {
    const validated = isRealString('    ');
    expect(validated).toBe(false);
  });

  it('should allow string with no-space characters', () => {
    const validated = isRealString('   kjakj289238j2jk ');
    expect(validated).toBe(true);
  });
});