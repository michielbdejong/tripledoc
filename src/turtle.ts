import { DataFactory, Quad, Writer, Parser } from 'n3';
import { Reference } from '.';

/**
 * @param quads Triples that should be serialised to Turtle
 * @ignore Utility method for internal use by Tripledoc; not part of the public API.
 */
export async function triplesToTurtle(quads: Quad[]): Promise<string> {
  const format = 'text/turtle';
  const writer = new Writer({ format: format });
  // Remove any references to Documents in the Quads;
  // they'll be determined by the URL the Turtle will be sent to:
  const triples = quads.map(quad => DataFactory.quad(quad.subject, quad.predicate, quad.object)); 
  writer.addQuads(triples);
  const writePromise = new Promise<string>((resolve, reject) => {
    writer.end((error, result) => {
      /* istanbul ignore if [n3.js doesn't actually pass an error nor a result, apparently: https://github.com/rdfjs/N3.js/blob/62682e48c02d8965b4d728cb5f2cbec6b5d1b1b8/src/N3Writer.js#L290] */
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });

  const rawTurtle = await writePromise;
  return rawTurtle;
}

/**
 * @param raw Turtle that should be parsed into Triples
 * @ignore Utility method for internal use by Tripledoc; not part of the public API.
 */
export async function turtleToTriples(raw: string, documentRef: Reference): Promise<Quad[]> {
  const format = 'text/turtle';
  const parser = new Parser({ format: format, baseIRI: documentRef });

  const parsingPromise = new Promise<Quad[]>((resolve, reject) => {
    const parsedTriples: Quad[] = [];
    parser.parse(raw, (error, quad, _prefixes) => {
      if (error) {
        return reject(error);
      }
      if (quad) {
        quad.graph = DataFactory.namedNode(documentRef);
        parsedTriples.push(quad);
      } else {
        resolve(parsedTriples);
      }
    });
  });

  return parsingPromise;
}
