# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

The sipgate.io Node.js library

- [Download](#download)
- [Methods](#methods)
- [Available Functionality](#available-functionality)
- [Privacy Note](#privacy-note)

## Download

`git clone https://github.com/sipgate-io/sipgateio-node`

## Methods

### createClient(username, password)

```typescript
const client = createClient('<your email-address>', '<your password>');
```

The `createClient` method returns a sipgate.io Client after passing your valid sipgate credentials.

## Available Functionality

Currently, the library includes SMS, Fax, and phone call capabilities. The SMS module supports both instant and scheduled sending of text messages with the .

## Privacy Note

This library sets the following headers for every request made to the sipgate REST-API to obtain statistics about versions currently in use and to differentiate sipgate.io-users from sipgate software:

- X-Sipgate-Client
- X-Sipgate-Version
