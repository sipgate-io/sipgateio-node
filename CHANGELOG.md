# 2.13.0

## Features

- add functions to get common IDs ([9b73faa](https://github.com/sipgate-io/sipgateio-node/commit/9b73faa8629965b9fbb6faa8c4600b16a5ba12ec))

# 2.8.0

## Features

- contacts can now be exported to JSON-files ([abf6355](https://github.com/sipgate-io/sipgateio-node/commit/abf63350158f39ce6d28a3e9d486b96df722d1cd))

# 2.0.0

## Features

- add plus to phone numbers in webhook events ([e3494aa](https://github.com/sipgate-io/sipgateio-node/commit/e3494aa))
- specify ./dist/module.js as "browser" in package.json ([eac8175](https://github.com/sipgate-io/sipgateio-node/commit/eac8175))
- throw error when serverAddress is missing for Follow-up events ([b57db1c](https://github.com/sipgate-io/sipgateio-node/commit/b57db1c))
- allow string as port in `ServerOptions` ([d10688b](https://github.com/sipgate-io/sipgateio-node/commit/d10688be98da96c0963558836b03e3678f9da9be))
- add method to retrieve the webuser id of the authenticated webuser ([a16e5de](https://github.com/sipgate-io/sipgateio-node/commit/a16e5de316cdad17d91ecaae72a8764c4c8ea15d))
- add `getFaxlines` function to fax module ([5d4c0cd](https://github.com/sipgate-io/sipgateio-node/commit/5d4c0cdbbee007e7e3718407595735901ee8e1f7))

## Breaking Changes

From now on, Node 8 is not supported anymore. It has reached End Of Life in December 2019 and you should upgrade to newer versions.

We have switched from using `master` as the default branch name to `main`. Unless you directly depended on that branch name there is nothing you should need to be doing.

- rename `from` and `to` to `startDate` and `endDate` in order to avoid confusion ([8bb8d41](https://github.com/sipgate-io/sipgateio-node/commit/8bb8d410f6d1a5810a6d74631ef0a99e61e9a97d))
- rename `import` to `create` and `exportAsObject` to `get` in contacts module ([6beadaa](https://github.com/sipgate-io/sipgateio-node/commit/6beadaaccf33df100564d9f78366191d5d675848))
- the fields `user[]`, `userId[]` und `fullUserId[]` are now called `users`, `userIds` and `originalUserFull` ([a9572d](https://github.com/sipgate-io/sipgateio-node/commit/a9572df5359a81a491f9c2dfcfbbb1c7c5037766))
- the `get`, `post` etc. methods on the `SipgateIOClient` now return the response directly instead of an axios object
- the http methods `get`, `post` etc. on the `SipgateIOClient` dont choose `any` as the default type parameter anymore ([f1f1931](https://github.com/sipgate-io/sipgateio-node/commit/f1f1931d9b379f34aa3cda02da81c94454a5b542))
- remove interfaces marked as `@deprecated` ([f7f4c7f](https://github.com/sipgate-io/sipgateio-node/commit/f7f4c7f723428d3b5803732f8f8e60c35b73f919))
- fix: contact import now accepts an array of string arrays for organizations ([3f55e75](https://github.com/sipgate-io/sipgateio-node/commit/3f55e75))
- fix: don't export HistoryDirection as Direction ([c80341a](https://github.com/sipgate-io/sipgateio-node/commit/c80341a))
- fix: export additional types from top-level index.ts ([626209c](https://github.com/sipgate-io/sipgateio-node/commit/626209c))
- fix: make user, userId and fullUserId optional in type AnswerEvent ([52d96cf](https://github.com/sipgate-io/sipgateio-node/commit/52d96cf))
- fix: the FaxHistoryEntry now correctly exposes the faxStatus key instead of faxStatusType ([3401bb5](https://github.com/sipgate-io/sipgateio-node/commit/3401bb5))
