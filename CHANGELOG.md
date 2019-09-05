# Changelog

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### New features

- It is now possible to remove properties from a Subject using `removeLiteral`, `removeNodeRef`, and to replace existing values with a new one using `setLiteral` and `setNodeRef`.

## [1.1.0] - 2019-09-03

### New features

- It is now possible to store and retrieve Date objects to and from a Pod.

### Fixed bugs

- Numbers stored in the Pod were returned as strings.

## [1.0.0] - 2019-08-28

### New features

- First release! With this release, it is possible to fetch a Document, read the properties of the Subjects it contains, add new properties, and to save them back to the Pod.
