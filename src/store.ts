import { Quad } from 'n3';
import SolidAuthClient from 'solid-auth-client';
import { triplesToTurtle } from './turtle';

/**
 * Utility function that gets Triples located at a URL
 *
 * @param url Location of the Document contains the Triples.
 * @returns Promise that resolves with the Triples
 * @ignore Should not be used by library consumers directly.
 */
/* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
export async function get(url: string) {
  const response = await SolidAuthClient.fetch(url, {
    headers: {
      Accept: 'text/turtle',
    },
  });

  return response;
}

/**
 * Utility function that sends a PATCH request to the Pod to update a Document
 *
 * @param url Location of the Document that contains the Triples to delete, and should have the Triples to add.
 * @param triplesToDelete Triples currently present on the Pod that should be deleted.
 * @param triplesToAdd Triples not currently present on the Pod that should be added.
 * @returns Promise that resolves when the update was executed successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
/* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
export async function update(url: string, triplesToDelete: Quad[], triplesToAdd: Quad[]) {
  const rawTriplesToDelete = await triplesToTurtle(triplesToDelete);
  const rawTriplesToAdd = await triplesToTurtle(triplesToAdd);
  const deleteStatement = (triplesToDelete.length > 0)
    ? `DELETE DATA {${rawTriplesToDelete}}`
    : '';
  const insertStatement = (triplesToAdd.length > 0)
    ? `INSERT DATA {${rawTriplesToAdd}}`
    : '';
  const response = await SolidAuthClient.fetch(url, {
    method: 'PATCH',
    body: `${deleteStatement} ${insertStatement}`,
    headers: {
      'Content-Type': 'application/sparql-update',
    },
  });
  return response;
}

/**
 * Utility function that sends a PUT request to the Pod to create a new Document
 *
 * @param url URL of the Document that should be created.
 * @param triplesToAdd Triples that should be added to the Document.
 * @returns Promise that resolves with the response when the Document was created successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
/* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
export async function create(url: string, triplesToAdd: Quad[]): Promise<Response> {
  const rawTurtle = await triplesToTurtle(triplesToAdd);
  const response = await SolidAuthClient.fetch(url, {
    method: 'PUT',
    body: rawTurtle,
    headers: {
      'Content-Type': 'text/turtle',
      'If-None-Match': '*',
    },
  });
  return response;
}
