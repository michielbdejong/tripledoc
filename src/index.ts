import { NamedNode, Node, Literal } from 'rdflib';

export * from './document';
export * from './subject';
export * from './store';

/**
 * Literal values, i.e. values that do not point to other nodes in the Linked Data graph.
 */
export type LiteralTypes = string | number;
/**
 * A URL that points to a node in the Linked Data graph.
 */
export type NodeRef = string;

/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a Literal, so
 *         this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an RDFlib Literal.
 * @returns Whether `param` is an RDFlib Literal.
 */
export function isLiteral<T>(param: T | Literal): param is Literal {
  return (typeof param === 'object') &&
    (param !== null) &&
    (typeof (param as Literal).termType === 'string') &&
    (param as Literal).termType === 'Literal';
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a [[NodeRef]],
 *         so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be a reference to a node in the Linked Data graph.
 * @returns Whether `param` is a reference to a node in the Linked Data graph.
 */
export function isNodeRef(node: NodeRef | Literal): node is NodeRef {
  return typeof node === 'string' && !isLiteral(node);
}
