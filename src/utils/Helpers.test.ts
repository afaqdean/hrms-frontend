import { getCanonicalUrl } from './Helpers';

describe('Helpers', () => {
  describe('getCanonicalUrl function', () => {
    it('should return the correct canonical URL for a given path', () => {
      const path = '/dashboard/admin/overview';
      const result = getCanonicalUrl(path);

      expect(result).toContain('/dashboard/admin/overview');
    });

    it('should handle root path correctly', () => {
      const path = '/';
      const result = getCanonicalUrl(path);

      expect(result).toContain('/');
    });
  });
});
