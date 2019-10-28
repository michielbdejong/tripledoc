# Changelog

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Deprecations

A number of deprecations to remove mentions of "nodes", simplifying them to simply "references".

- `getNodeRef`, `getAllNodeRefs`, `addNodeRef`, `removeNodeRef`, `setNodeRef` and `asNodeRef` have been superseded by `getRef`, `getAllRefs`, `addRef`, `removeRef`, `setRef` and `asRef`, respectively, and are therefore now deprecated - they will be removed in a future major version.
- The exported type `NodeRef` is now called `Reference`, and the former is therefore deprecated.

## [2.0.0] - 2019-10-24

### Breaking changes

- A TripleDocument is no longer mutable, meaning that the values you read from it (Subjects, properties on those Subjects, …) will not change after you call `save()` on it, even if those values have been updated in the Pod. Instead, `save()` will now return a new TripleDocument that _does_ contain the updated values. This provides benefits to those wanting to access the "old" data, those who prefer working with immutable data structures, or work with a library that does, such as React.

## [1.4.0] - 2019-10-14

### Deprecations

- `getLiteral` and `getAllLiterals` have been superseded by their respective type-specific methods (`getString`, `getInteger`, etc.), and are therefore now deprecated - they will be removed in a future major version.

### New features

- You can now query specifically for string, integer, decimal or DateTime values on a Subject, instead of having to check whether the return value of `getLiteral` (or `getAllLiterals`) is of the type you want.

### Bug fixes

- The source directory for the website is no longer published along with the package itself to npm, saving you precious bytes on your hard drive.

## [1.3.2] - 2019-10-02

### Bugfixes

- Saving an existing Document did not work due to [a bug in rdflib](https://github.com/linkeddata/rdflib.js/issues/359). Pending a fix upstream, Tripledoc will temporarily include an older version of rdflib.

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
