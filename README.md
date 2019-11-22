# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

A JavaScript library for sipgate.io

- [Installation](#installation)
- [Available Functionality](#available-functionality)
- [Usage](#usage)
- [Examples](#examples)
- [Privacy Note](#privacy-note)

# Get Started

## Installation

For use in node applications you can install with

```console
npm install https://github.com/sipgate-io/sipgateio-node
```

Alternatively, a bundled version can be obtained from the [github releases](https://github.com/sipgate-io/sipgateio-node/releases) page.

## Available Functionality

The following features are already implemented in the current version of this library:

### SMS

Send text messages, either instantly or scheduled. The caller ID can be set from the sipgate web interface, the default is the string "sipgate".

### Fax

Send any PDF file buffer as a fax to a single number.

### Call

Initiate a call between two phones of your choice, no matter if inside your sipgate account or outside.

### Settings

Make setting for sipgate.io. Currently, setting URLs for webhooks is supported.

## Usage

### Creating a Client

```typescript
const client = createClient({
	username: '<your username',
	password: '<your password>',
});
```

Possible Authentication Objects

```typescript
interface BasicAuthCredentials {
	username: string;
	password: string;
}
```

The `createClient` method accepts your valid sipgate credentials as defined in the `AuthCredentials` type and returns a sipgate.io Client.
The client contains as members the supported modules (e.g. `sms`, `fax`, `call`, `contacts`).

### SMS

The SMS module provides the following functions:

```typescript
async function send(sms: ShortMessage): Promise<void>;
async function schedule(sms: ShortMessage, sendAt: Date): Promise<void>;
```

The `ShortMessage` type requires the following fields:

```typescript
interface ShortMessage {
	smsId: string;
	recipient: string;
	message: string;
	sendAt?: number;
}
```

### Fax

The fax module provides the following functions:

```typescript
async function send(fax: Fax): Promise<SendFaxSessionResponse>;
async function getFaxStatus(sessionId: string): Promise<FaxStatusType>;
```

The `send` function allows you to send a fax by passing an object with the following fields:

```typescript
interface Fax {
	recipient: string;
	fileContent: Buffer;
	filename?: string;
	faxlineId?: string;
}
```

and returns an `SendFaxSessionResponse`:

```typescript
interface SendFaxSessionResponse {
	sessionId: string;
}
```

By using `getFaxStatus` and passing the `sessionId` you received from the `send` function, you will receive one of the following values:

```typescript
enum FaxStatusType {
	SENT = 'SENT',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	SENDING = 'SENDING',
	SCHEDULED = 'SCHEDULED',
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
interface ClickToDial {
	deviceId?: string;
	caller: string;
	callee: string;
	callerId?: string;
}
```

The `InitiateNewCallSessionResponse` contains only a session ID:

```typescript
interface InitiateNewCallSessionResponse {
	sessionId: string;
}
```

#### ClickToDial details

The following table shows valid parameter combinations

| callee | caller    | callerId | deviceId  |
| ------ | --------- | -------- | --------- |
| number | extension | -        | -         |
| number | extension | number   | -         |
| number | extension | number   | extension |
| number | number    | -        | extension |
| number | extension | -        | extension |
| number | number    | number   | extension |

The displayed number at the callee device is determined by a **hierarchy**.

If not set it falls back to the next stage:

1. callerId
2. deviceId (related phone number)
3. caller (related phone number if ext)

The param deviceId is only mandatory if `caller` is not a extension.

Valid extension types are _e_, _p_, _x_ and _y_.

| phone type     | letter |
| -------------- | ------ |
| VoIP phone     | e      |
| user phoneline | p      |
| external phone | x      |
| mobile phone   | y      |

---

**Example for basic call:**

```typescript
clickToDial(caller, callee);
```

```json
caller: 'e14',
callee: '021165432'
```

default number of extension is displayed at callee device.

**Another example:**

```typescript
clickToDial(caller, callee, callerId);
```

```json
caller: 'p0',
callee: '021165432',
callerId: '017012345678'
```

same situation as previous example but displayed number is now `callerId` ([see hierarchy](###ClickToDial-details)).

---

**Example for group calls:**

```typescript
clickToDial(caller, deviceId, callee);
```

```json
caller: '021123456',
deviceId: 'e14',
callee: '021165432'
```

`caller` is the group number which is used to initiate the call => the group is called

`deviceId` is needed for billing and determines the number which will be displayed at the callee device. For e.g. 'e14' has the default number '021156789'.

---

### Settings

The settings module provides the following functions to update settings:

```typescript
interface SettingsModule {
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
