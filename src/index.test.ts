import { isLiteral, isNodeRef } from './index';
import { lit, sym } from 'rdflib';

describe('isLiteral', () => {
  it('should return true if a value is an RDFlib `Literal`', () => {
    expect(isLiteral(lit('Some value', 'en', sym('http://arbitrary-node.com'))))
      .toBe(true);
  });

  it('should return false for an arbitrary other object', () => {
    expect(isLiteral({ arbitrary: 'object' })).toBe(false);
  });

  it('should return false for null', () => {
    expect(isLiteral(null)).toBe(false);
  });

  it('should return false for atomic Javascript values', () => {
    expect(isLiteral('arbitrary string')).toBe(false);
    expect(isLiteral(4.2)).toBe(false);
    expect(isLiteral(true)).toBe(false);
    expect(isLiteral(undefined)).toBe(false);
  });
});

describe('isNodeRef', () => {
  it('should return true if a value is a string', () => {
    expect(isNodeRef('http://some-node.com')).toBe(true);
  });

  it('should return false if a value is an RDFLib Literal', () => {
    expect(isNodeRef(lit('Some value', 'en', sym('http://arbitrary-node.com'))))
      .toBe(false);
  });

  it('should return false if a value is not a string and hence cannot be a URL', () => {
    expect(isNodeRef({ arbitrary: 'object' } as any)).toBe(false);
    expect(isNodeRef(13.37 as any)).toBe(false);
    expect(isNodeRef(null as any)).toBe(false);
    expect(isNodeRef(true as any)).toBe(false);
  });
});
