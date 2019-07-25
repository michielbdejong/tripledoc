import { NamedNode, sym } from 'rdflib';
import { NodeRef } from './index';

type Namespace = (identifier: string) => NodeRef;

/**
 * This function can be used to generate helpers for namespaces that will be commonly used in an app.
 *
 * @param prefix The general prefix used for this namespace, e.g. `http://www.w3.org/2006/vcard/ns#`
 * @return A helper function that can be used to refer to terms in that namespace, e.g. `vcard('role')` to generate a reference to `http://www.w3.org/2006/vcard/ns#role`.
 */
export function generateNamespace(prefix: string): Namespace {
  return (identifier: string) => prefix + identifier;
}
export const acl: Namespace = generateNamespace('http://www.w3.org/ns/auth/acl#');
export const arg: Namespace = generateNamespace('http://www.w3.org/ns/pim/arg#');
export const cal: Namespace = generateNamespace('http://www.w3.org/2002/12/cal/ical#');
export const contact: Namespace = generateNamespace('http://www.w3.org/2000/10/swap/pim/contact#');
export const dc: Namespace = generateNamespace('http://purl.org/dc/elements/1.1/');
export const dct: Namespace = generateNamespace('http://purl.org/dc/terms/');
export const doap: Namespace = generateNamespace('http://usefulinc.com/ns/doap#');
export const foaf: Namespace = generateNamespace('http://xmlns.com/foaf/0.1/');
export const http: Namespace = generateNamespace('http://www.w3.org/2007/ont/http#');
export const httph: Namespace = generateNamespace('http://www.w3.org/2007/ont/httph#');
export const icalTZ: Namespace = generateNamespace('http://www.w3.org/2002/12/cal/icaltzd#');
export const ldp: Namespace = generateNamespace('http://www.w3.org/ns/ldp#');
export const link: Namespace = generateNamespace('http://www.w3.org/2007/ont/link#');
export const log: Namespace = generateNamespace('http://www.w3.org/2000/10/swap/log#');
export const meeting: Namespace = generateNamespace('http://www.w3.org/ns/pim/meeting#');
export const mo: Namespace = generateNamespace('http://purl.org/ontology/mo/');
export const owl: Namespace = generateNamespace('http://www.w3.org/2002/07/owl#');
export const pad: Namespace = generateNamespace('http://www.w3.org/ns/pim/pad#');
export const patch: Namespace = generateNamespace('http://www.w3.org/ns/pim/patch#');
export const qu: Namespace = generateNamespace('http://www.w3.org/2000/10/swap/pim/qif#');
export const trip: Namespace = generateNamespace('http://www.w3.org/ns/pim/trip#');
export const rdf: Namespace = generateNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
export const rdfs: Namespace = generateNamespace('http://www.w3.org/2000/01/rdf-schema#');
export const rss: Namespace = generateNamespace('http://purl.org/rss/1.0/');
export const sched: Namespace = generateNamespace('http://www.w3.org/ns/pim/schedule#');
export const schema: Namespace = generateNamespace('http:/schema.org/');
export const sioc: Namespace = generateNamespace('http://rdfs.org/sioc/ns#');
export const solid: Namespace = generateNamespace('http://www.w3.org/ns/solid/terms#');
export const space: Namespace = generateNamespace('http://www.w3.org/ns/pim/space#');
export const stat: Namespace = generateNamespace('http://www.w3.org/ns/posix/stat#');
export const tab: Namespace = generateNamespace('http://www.w3.org/2007/ont/link#');
export const ui: Namespace = generateNamespace('http://www.w3.org/ns/ui#');
export const vcard: Namespace = generateNamespace('http://www.w3.org/2006/vcard/ns#');
export const wf: Namespace = generateNamespace('http://www.w3.org/2005/01/wf/flow#');
export const xsd: Namespace = generateNamespace('http://www.w3.org/2001/XMLSchema#');
