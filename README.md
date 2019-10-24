tripledoc
======
Read, create and edit [RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework) documents on [Solid](https://solid.inrupt.com/) Pods.

Tripledoc aims to mesh well with the way of thinking of developers that are not necessarily well-versed in RDF or Linked Data, and just want to store their data on a Solid Pod. Its goal is to make it as easy as possible to get started writing Solid apps, and therefore tries to avoid [magic](https://en.wikipedia.org/wiki/Magic_(programming)), is extensively documented, and publishes type declarations for editors that support TypeScript.

It is recommended to use Tripledoc in combination with the package [rdf-namespaces](https://www.npmjs.com/package/rdf-namespaces).

# Installation

```bash
npm install tripledoc
```

# Usage

```javascript
import { fetchDocument } from 'tripledoc';
import { foaf } from 'rdf-namespaces';

fetchDocument('https://www.w3.org/People/Berners-Lee/card')
.then(profileDoc => {
  const profile = profileDoc.getSubject('https://www.w3.org/People/Berners-Lee/card#i');
  const name = profile.getString(foaf.name);
  console.log('The name in this profile is:', name);

  profile.addNodeRef(foaf.knows, 'https://vincentt.inrupt.net/profile/card#me');
  profile.addLiteral(foaf.nick, 'timbl');

  // Credentials are included [1] in this request, so make sure those are set
  // properly if needed. The package solid-auth-client [2] might be of assistance
  // here.
  // [1] https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included
  // [2] https://www.npmjs.com/package/solid-auth-client
  profileDoc.save().then(() => console.log('Profile updated!'));
});
```

# Changelog

See [CHANGELOG](https://gitlab.com/vincenttunru/tripledoc/blob/master/CHANGELOG.md).

# License

MIT © [Inrupt](https://inrupt.com)
