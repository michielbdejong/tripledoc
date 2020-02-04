import { Literal, BlankNode, NamedNode } from 'n3';

export * from './document';
export * from './subject';
export * from './store';

/**
 * Literal values, i.e. values that do not point to other nodes in the Linked Data graph.
 */
export type LiteralTypes = string | number | Date;
/**
 * A URL that points to a node in the Linked Data graph.
 */
export type Reference = string;
/**
 * @ignore Deprecated.
 * @deprecated Replaced by [[Reference]].
 */
export type NodeRef = Reference;

/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a Literal, so
 *         this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 Literal.
 * @returns Whether `param` is an N3 Literal.
 */
export function isLiteral<T>(param: T | Literal): param is Literal {
  return (typeof param === 'object') &&
    (param !== null) &&
    (typeof (param as Literal).termType === 'string') &&
    (param as Literal).termType === 'Literal';
}
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface StringLiteral extends Literal {
  datatype: NamedNode & { value: 'http://www.w3.org/2001/XMLSchema#string' };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 string Literal.
 * @returns Whether `param` is an N3 string Literal.
 */
export function isStringLiteral<T>(param: T | Literal): param is StringLiteral {
  return isLiteral(param) && param.datatype.value === 'http://www.w3.org/2001/XMLSchema#string';
}
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface LocaleStringLiteral<Locale extends string> extends Literal {
  datatype: NamedNode & { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString' };
  language: Locale;
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 locale string Literal.
 * @returns Whether `param` is an N3 locale string Literal with the given locale.
 */
export function isLocaleStringLiteral<T, Locale extends string>(
  param: T | Literal,
  locale: Locale,
): param is LocaleStringLiteral<Locale> {
  return isLiteral(param) &&
    param.datatype.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString' &&
    param.language.toLowerCase() === locale.toLowerCase();
}
/**
 * Primarily useful to create type guarsd for use in e.g. `Array.prototype.filter`.
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export function generateLocaleTypeGuard<Locale extends string>(locale: Locale) {
  return function typeGuard<T>(param: T | Literal): param is LocaleStringLiteral<Locale> {
    return isLocaleStringLiteral(param, locale);
  }
}
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface IntegerLiteral extends Literal {
  datatype: NamedNode & { value: 'http://www.w3.org/2001/XMLSchema#integer' };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 integer Literal.
 * @returns Whether `param` is an N3 integer Literal.
 */
export function isIntegerLiteral<T>(param: T | Literal): param is IntegerLiteral {
  return isLiteral(param) && param.datatype.value === 'http://www.w3.org/2001/XMLSchema#integer';
}
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface DecimalLiteral extends Literal {
  datatype: NamedNode & { value: 'http://www.w3.org/2001/XMLSchema#decimal' };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 decimal Literal.
 * @returns Whether `param` is an N3 decimal Literal.
 */
export function isDecimalLiteral<T>(param: T | Literal): param is DecimalLiteral {
  return isLiteral(param) && param.datatype.value === 'http://www.w3.org/2001/XMLSchema#decimal';
}
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface DateTimeLiteral extends Literal {
  datatype: NamedNode & { value: 'http://www.w3.org/2001/XMLSchema#dateTime' };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 DateTime Literal.
 * @returns Whether `param` is an N3 DateTime Literal.
 */
export function isDateTimeLiteral<T>(param: T | Literal): param is DateTimeLiteral {
  return isLiteral(param) && param.datatype.value === 'http://www.w3.org/2001/XMLSchema#dateTime';
}

/**
 * @ignore Deprecated function.
 * @deprecated Replaced by [[isReference]].
 */
export const isNodeRef = isReference;

/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a [[Reference]],
 *         so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be a reference to a node in the Linked Data graph.
 * @returns Whether `param` is a reference to a node in the Linked Data graph.
 */
export function isReference(value: Reference | BlankNode | Literal): value is Reference {
  return typeof value === 'string' && !isLiteral(value);
}

/**
 * @ignore Blank Nodes themselves should not be exposed to library consumers, so this is merely an
 *         internal utility function, rather than a public API.
 * @param param A value that might or might not be a blank node in the Linked Data graph.
 * @returns Whether `param` is a blank node in the Linked Data graph.
 */
export function isBlankNode(param: Reference | Literal | BlankNode): param is BlankNode {
  return (typeof param === 'object') &&
    (param !== null) &&
    (typeof (param as BlankNode).termType === 'string') &&
    (param as BlankNode).termType === 'BlankNode';
}
