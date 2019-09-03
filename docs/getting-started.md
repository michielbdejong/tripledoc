---
id: getting-started
title: Getting started with Solid
---

If you're already familiar with how Solid works, the [Quick start](#quick-start) below should give you a
feel of what working with Tripledoc looks like.

If not, follow our [guide to writing Solid Apps](writing-a-solid-app).

## Quick start

It is recommended to install Tripledoc together with
[rdf-namespaces](https://www.npmjs.com/package/rdf-namespaces) for easy access
to common vocabularies and their terms:

    npm install --save tripledoc rdf-namespaces

The two primary data structures in Tripledoc are the
[TripleDocument](api/interfaces/tripledocument/) and the
[TripleSubject](api/interfaces/triplesubject/). The former represents an
[RDF Document](https://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#dfn-rdf-document),
the latter a node in the RDF graph that can be queried for
[Triples](https://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#dfn-rdf-triple)
in which it occurs as the Subject.

Following is an example that fetches the Document containing Tim Berners-Lee's
profile, then queries the Subject that represents that Profile to retrieve his
name, and to fetch another Document listing his friends:

```typescript
import { fetchDocument } from 'tripledoc';
import { foaf, rdfs } from 'rdf-namespaces';

async function getTimblProfile() {
  const profileDocument = await fetchDocument('https://www.w3.org/People/Berners-Lee/card');
  const profile = profileDoc.getSubject('https://www.w3.org/People/Berners-Lee/card#i');
  return profile;
}

function getName(profile) {
  return profile.getLiteral(foaf.name);
}

async function getFriends(profile) {
  const friendsDocumentUrl = profile.getNodeRef(rdfs.seeAlso);
  const friendsDocument = await fetchDocument(friendsDocumentUrl);
  return friendsDocument.getSubjectsOfType(foaf.Person);
}
```
