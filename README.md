# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

A JavaScript library for [sipgate.io](https://www.sipgate.io/)

- [Installation](#installation)
- [Available Functionality](#available-functionality)
- [Usage](#usage)
- [Examples](#examples)
- [Privacy Note](#privacy-note)

# Get Started

## Installation

For use in node applications you can install with

```console
npm install git://github.com/sipgate-io/sipgateio-node.git --save
```

Alternatively, a bundled version can be obtained from the [github releases](https://github.com/sipgate-io/sipgateio-node/releases) page.

## Available Functionality

The following features are already implemented in the current version of this library:

### SMS

Send text messages, either instantly or scheduled. The caller ID can be set from the sipgate web interface, the default is the string "sipgate".

### Fax

Send any PDF file buffer as a fax to a single number.

### Call

Initiate a call between two phones of your choice – no matter if inside your sipgate account or outside.

### Webhook Settings

Configure the webhook functionality of sipgate.io. Currently, you can set URLs and whitelist extensions for triggering webhooks as well as toggle the debug log.

### Contacts

Import contacts in CSV format into your sipgate account.

## Usage

### Creating a Client

You can connect the client by passing a valid OAuth token (You have to implement the OAuth flow yourself):

```typescript
const client = sipgateIO({
	token: '<valid Token>',
});
```

As alternative you can also pass your credentials to the API-Client which will use Basic Auth. (Remember: This way is **not** recommended)

```typescript
const client = sipgateIO({
	username: '<your username>',
	password: '<your password>',
});
```

Possible authentication objects:

```typescript
interface BasicAuthCredentials {
	username: string;
	password: string;
}
```

```typescript
interface OAuthCredentials {
	token: string;
}
```

```typescript
type AuthCredentials = BasicAuthCredentials | OAuthCredentials;
```

The `sipgateIO` method accepts your valid sipgate credentials as defined in the `AuthCredentials` type and returns a sipgate.io Client.
The client contains as members the supported modules (`sms`, `fax`, `call`, etc.).

### SMS

The SMS module provides the following functions:

```typescript
async function send(sms: ShortMessage): Promise<void>;
async function schedule(sms: ShortMessage, sendAt: Date): Promise<void>;
```

Note: `sendAt` can be 30 days in advance at max.

Note: you should be aware that the request will take a short time to be processed. So values for `sendAt` which are just a few seconds in advance won't make any sense.

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
async function getFaxStatus(sessionId: string): Promise<FaxStatus>;
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
enum FaxStatus {
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
	newCallRequest: CallData
): Promise<InitiateNewCallSessionResponse>;
```

The `CallData` type requires the following fields:

```typescript
interface CallData {
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

#### CallData details

The following table shows valid parameter combinations

| callee | caller    | callerId | deviceId  |
| ------ | --------- | -------- | --------- |
| number | extension | -        | -         |
| number | extension | number   | -         |
| number | extension | number   | extension |
| number | number    | -        | extension |
| number | extension | -        | extension |
| number | number    | number   | extension |

The displayed number at the callee device is determined by a **hierarchy**:

If not set it falls back to the next stage:

1. `callerId`
2. `deviceId` (related phone number)
3. `caller` (related phone number if `caller` is an extension)

The param `deviceId` is only mandatory if `caller` is not an extension.

Valid extension types are _e_, _p_, _x_ and _y_.

| extension type | phone type     |
| :------------: | -------------- |
|       e        | VoIP phone     |
|       p        | user phoneline |
|       x        | external phone |
|       y        | mobile phone   |

**Scenario 1: basic call**

```typescript
const callData = {
	caller: 'e14',
	callee: '+4921165432',
};

client.call.initiate(callData);
```

**Behavior**:
The phone with extension `e14` rings first, after pick-up the `callee` is called. The default number associated with `e14` is displayed at the callee device.

**Scenario 2: custom caller id**

```typescript
const callData = {
	caller: 'p0',
	callee: '+4921165432',
	callerId: '+4917012345678',
};

client.call.initiate(callData);
```

**Behavior**:
Same situation as previous example, but displayed number is now `callerId` ([see hierarchy](#calldata-details)).

**Scenario 3: group caller**

```typescript
const callData = {
	caller: '+4921123456',
	deviceId: 'e14',
	callee: '+4921165432',
};

client.call.initiate(callData);
```

If the `caller` number refers to a group of phones rather than a single one all phones in the group will ring and the first to be picked up will establish the call with the `callee`.

The `deviceId` is needed for billing and determines the number which will be displayed at the callee device. For instance, `e14` has the default number '+4921156789'.

### Webhook Settings

#### What is a webhook?

A webhook is a POST request that sipgate.io makes to a predefined URL when a certain event occurs. These requests contain information about the event that occurred in application/x-www-form-urlencoded format.

The webhook settings module provides the following functions to update settings:

```typescript
async function setIncomingUrl(url: string): Promise<void>;
async function clearIncomingUrl(): Promise<void>;
```

These two functions allow for the setting and clearing of the URL to be called when a webhook is triggered by an incoming call.

```typescript
async function setOutgoingUrl(url: string): Promise<void>;
async function clearOutgoingUrl(): Promise<void>;
```

Analogous functions exist for the URL that handles outgoing calls.

```typescript
async function setWhitelist(extensions: string[]): Promise<void>;
async function clearWhitelist(): Promise<void>;
async function disableWhitelist(): Promise<void>;
```

The whitelist specifies extensions that should trigger webhooks.
By default, webhooks are enabled for all phoneline and group extensions.
This behavior is restored by calling `disableWhitelist`.

```typescript
async function setLog(value: boolean): Promise<void>;
```

The logging of webhook calls can be enabled and disabled with `setLog(true)` and `setLog(false)`.

### Contacts

The contacts module provides the following function:

```typescript
interface ContactsModule {
	importFromCsvString: (csvContent: string) => Promise<void>;
}
```

It takes a valid CSV-formatted string (columns separated by ",") containing at least the following fields:

- firstname
- lastname
- number

These fields may be provided in an arbitrary order.
Additional fields as well as empty lines will be ignored.
Empty records (i.e. just separators) produce a warning but no error.
The same is true for strings containing only the header row.

_Example_:

```
lastname,firstname,number
Turing,Alan,+4921163553355
Lovelace,Ada,+4921163553355
```

## Examples

For some examples on how to use the library, please refer to the [examples folder](./examples).

[npx](https://www.npmjs.com/package/npx) can be used to run the code examples:

```
npx ts-node some_example.ts
```

## Privacy Note

This library sets the following headers for every request made to the sipgate REST-API to obtain statistics about versions currently in use and to differentiate sipgate.io-users from sipgate software:

- X-Sipgate-Client
- X-Sipgate-Version
