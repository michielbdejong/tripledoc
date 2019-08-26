import { NamedNode, Node, sym, lit, Literal } from 'rdflib';

export * from './document';
export * from './subject';
export * from './store';

export type LiteralTypes = string | number;
export function isLiteral<T>(param: T | Literal): param is Literal {
  return (typeof param === 'object') &&
    (param !== null) &&
    (typeof (param as Literal).termType === 'string') &&
    (param as Literal).termType === 'Literal';
}
export function isNodeRef(node: NodeRef | Literal): node is NodeRef {
  return typeof node === 'string' && !isLiteral(node);
}
/**
 * @ignore
 */
export function isNamedNode(node: Node): node is NamedNode {
  return typeof (node as NamedNode).uri === 'string';
}

export type NodeRef = string;
