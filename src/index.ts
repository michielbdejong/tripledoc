import { NamedNode, sym, lit, Literal } from 'rdflib';

export * from './document';
export * from './subject';
export * from './store';

export type LiteralTypes = string | number;
export function asLiteral(literal: LiteralTypes): Literal {
  // Unfortunately the typings are really incomplete, so we have to do some casting here:
  return new Literal(literal as string, undefined as any, undefined as any);
}

export function isLiteral<T>(param: T | Literal): param is Literal {
  return (typeof param === 'object') &&
    (typeof (param as Literal).termType === 'string') &&
    (param as Literal).termType === 'Literal';
}

export type NodeRef = string | NamedNode;
export function asNamedNode(uriOrNamedNode: NodeRef): NamedNode {
  return (typeof uriOrNamedNode === 'string') ? sym(uriOrNamedNode) : uriOrNamedNode;
}
