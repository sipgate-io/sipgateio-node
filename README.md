# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

The sipgate.io Node.js library

- [Download](#download)
- [Available Functionality](#available-functionality)
- [Usage](#usage)
- [Examples](#examples)
- [Privacy Note](#privacy-note)

# Get Started

## Download

`git clone https://github.com/sipgate-io/sipgateio-node`

## Installation

For use in node applications you can install with - `npm install https://github.com/sipgate-io/sipgateio-node`

For use in client side web applications get the JavaScript bundle from [github releases](#releases) and import in your project.

## Available Functionality

Currently, the library includes SMS, fax, and phone call capabilities. The SMS module supports both instant and scheduled sending of text messages with the default caller ID set for the SMS extension of the authenticated webuser.

## Usage

### Creating a Client

```typescript
const client = createClient('<your email-address>', '<your password>');
```

The `createClient` method accepts your valid sipgate credentials and returns a sipgate.io Client.
The client contains as members the supported modules (e.g. `sms`, `fax`, `call`).

### SMS

The SMS module provides the following functions:

```typescript
async function send(sms: ShortMessage): Promise<void>;
async function schedule(sms: ShortMessage, sendAt: Date): Promise<void>;
```

The `ShortMessage` type requires the following fields:

```typescript
export interface ShortMessage {
	smsId: string;
	recipient: string;
	message: string;
	sendAt?: number;
}
```

### Fax

The fax module provides the following function:

```typescript
async function send(fax: Fax): Promise<void>;
```

The `Fax` type requires the following fields:

```typescript
export interface Fax {
	recipient: string;
	fileContent: Buffer;
	filename?: string;
	faxlineId?: string;
}
```

### Call

The call module provides the following function:

```typescript
async function initiate(
	newCallRequest: ClickToDial
): Promise<InitiateNewCallSessionResponse>;
```

The `ClickToDial` type requires the following fields:

```typescript
export interface ClickToDial {
	deviceId?: string;
	caller: string;
	callee: string;
	callerId: string;
}
```

The `InitiateNewCallSessionResponse` contains only a session ID.

### Settings

The settings module provides the following functions to update settings:

```typescript
export interface SettingsModule {
	setIncomingUrl: (url: string) => Promise<void>;
	setOutgoingUrl: (url: string) => Promise<void>;
	setWhitelist: (extensions: string[]) => Promise<void>;
	setLog: (value: boolean) => Promise<void>;
	clearIncomingUrl: () => Promise<void>;
	clearOutgoingUrl: () => Promise<void>;
	clearWhitelist: () => Promise<void>;
	disableWhitelist: () => Promise<void>;
}
```

The `disableWhitelist` completely removes the whitelisting and enables all phoneline and group extensions.

## Examples

For some examples on how to use the library, please refer to the [`examples` folder](./examples).

## Privacy Note

This library sets the following headers for every request made to the sipgate REST-API to obtain statistics about versions currently in use and to differentiate sipgate.io-users from sipgate software:

- X-Sipgate-Client
- X-Sipgate-Version
