# Changelog

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.1] - 2019-10-01

### Experimental changes

- The `getAcl` method on a TripleDocument did not work for relative ACL URLs (as returned by Node Solid Server). It now has the more consistent name `getAclRef`, and should work with relative URLs. Additionally, it can now also return the location of the ACL for a newly created Document, provided it has been `save`d. Do keep in mind that this method is still experimental and may therefore be changed in a future patch release.

## [1.3.0] - 2019-09-06

### New features

- Tripledoc now also publishes a version that exports ES Modules - find it in the `module` field in `package.json`. This should allow bundles to only import the modules that are needed, theoretically significantly reducing the bundled size.

## [1.2.0] - 2019-09-05

### New features

- It is now possible to remove properties from a Subject using [`removeLiteral`](https://vincenttunru.gitlab.io/tripledoc/docs/api/interfaces/triplesubject/#removeliteral), [`removeNodeRef`](https://vincenttunru.gitlab.io/tripledoc/docs/api/interfaces/triplesubject/#removenoderef), and [`removeAll`](https://vincenttunru.gitlab.io/tripledoc/docs/api/interfaces/triplesubject/#removeall), and to replace existing values with a new one using [`setLiteral`](https://vincenttunru.gitlab.io/tripledoc/docs/api/interfaces/triplesubject/#setliteral) and [`setNodeRef`](https://vincenttunru.gitlab.io/tripledoc/docs/api/interfaces/triplesubject/#setnoderef).

## [1.1.0] - 2019-09-03

### New features

- It is now possible to store and retrieve Date objects to and from a Pod.

### Fixed bugs

- Numbers stored in the Pod were returned as strings.

## [1.0.0] - 2019-08-28

### New features

- First release! With this release, it is possible to fetch a Document, read the properties of the Subjects it contains, add new properties, and to save them back to the Pod.
