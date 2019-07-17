When you're ready to release a new version, perform the following steps:

- Update CHANGELOG.md, moving the items below the `Unreleased` heading below your new version
- Run `yarn version` (`--major`, `--minor` or `--patch`)
- Push the `master` branch with this new version to have a snapshot build published (as `@next`)
- `git push --tags` to have the actual new version published