import { allFormFieldsComplete } from '../../../client/javascript/utils';

describe('Utils', () => {
  describe('#allFormFieldsComplete', () => {
    it('returns true if all required fields are not empty', () => {
      const data = { foo: 'bar', bar: 'baz' };
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.be.true;
    });

    it('returns false is if some required field  empty', () => {
      const data = { foo: '', bar: 'baz' };
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.be.false;
    });

    it('returns false if there are no fields in the data', () => {
      const data = {};
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.be.false;
    });

    it('returns true if there are no required fields', () => {
      const data = { foo: '', bar: 'baz' };
      const requiredFields = [];

      expect(allFormFieldsComplete(data, requiredFields)).to.be.true;
    });
  });
});
