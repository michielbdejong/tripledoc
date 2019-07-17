import { NamedNode, sym, lit, Literal } from 'rdflib';

export * from './document';
export * from './subject';
export * from './store';

export function asLiteral(literal: string | number): Literal {
  // Unfortunately the typings are really incomplete, so we have to do some casting here:
  return new Literal(literal as string, undefined as any, undefined as any);
}
export function asNamedNode(uriOrNamedNode: string | NamedNode): NamedNode {
  return (typeof uriOrNamedNode === 'string') ? sym(uriOrNamedNode) : uriOrNamedNode;
}
