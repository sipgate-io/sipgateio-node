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
npm install sipgateio --save
```

Alternatively, a bundled version can be obtained from the [github releases](https://github.com/sipgate-io/sipgateio-node/releases) page.  
Or use a CDN like jsDelivr instead:  
[https://cdn.jsdelivr.net/gh/sipgate-io/sipgateio-node@latest/bundle/sipgate-io.js](https://cdn.jsdelivr.net/gh/sipgate-io/sipgateio-node@latest/bundle/sipgate-io.js)

## Available Functionality

For example a Text Message can be send with following code:

```typescript
import { sipgateIO, createSMSModule } from 'sipgateio';

const client = sipgateIO({ username: 'username', password: 'password' });
const sms = createSMSModule(client);
sms.send({
	from: '+4901570000000',
	to: '+491579999999',
	message: 'Lorem Ipsum',
});
```

The following features are already implemented in the current version of this library:

### SMS

Send text messages, either instantly or scheduled. The caller ID can be set from the sipgate web interface, the default is the string "sipgate".

### Fax

Send any PDF file as a fax to a single number.

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

The `sipgateIO` method accepts your valid sipgate credentials as defined in the `AuthCredentials` type and returns a sipgate.io Client.
The client contains as members the supported modules (`sms`, `fax`, `call`, etc.).

### SMS

The SMS module provides the following functions:

```typescript
async function send(sms: ShortMessage): Promise<void>;
async function schedule(sms: ShortMessage, sendAt: Date): Promise<void>;
```

Note: `sendAt` can be 30 days in advance at max.

Note: you should be aware that the request will take a short time to be processed. Values for `sendAt` should not just be a few seconds in the future. If sendAt is in the past an error will be thrown.

The `ShortMessage` type requires the following fields:

```typescript
interface ShortMessage {
	smsId: string;
	to: string;
	message: string;
}
```

or

```typescript
interface ShortMessage {
	from: string;
	to: string;
	message: string;
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
	to: string;
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

The `CallData` contains the following fields:

```typescript
interface CallData {
	deviceId?: string;
	from: string;
	to: string;
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

| to     | from      | callerId | deviceId  |
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
3. `from` (related phone number if `from` is an extension)

The param `deviceId` is only mandatory if `from` is not an extension.

Valid extension types are _e_, _p_, _x_ and _y_.

| extension type | phone type     |
| :------------: | -------------- |
|       e        | VoIP phone     |
|       p        | user phoneline |
|       x        | external phone |
|       y        | mobile phone   |

**Scenario 1: basic call**

```typescript
const call = createCallModule(client);
const callData = {
	from: 'e14',
	to: '+4921165432',
};

call.initiate(callData);
```

**Behavior**:
The phone with extension `e14` rings first, after pick-up the `callee` is called. The default number associated with `e14` is displayed at the callee device.

**Scenario 2: custom caller id**

```typescript
const callData = {
	from: 'p0',
	to: '+4921165432',
	callerId: '+4917012345678',
};

call.initiate(callData);
```

**Behavior**:
Same situation as previous example, but displayed number is now `callerId` ([see hierarchy](#calldata-details)).

**Scenario 3: group call**

```typescript
const callData = {
	from: '+4921123456',
	deviceId: 'e14',
	to: '+4921165432',
};

call.initiate(callData);
```

If the `from` number refers to a group of phones rather than a single one all phones in the group will ring and the first to be picked up will establish the call with the `to`.

The `deviceId` is needed for billing and determines the number which will be displayed at the `to` device. For instance, `e14` has the default number '+4921156789'.

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
The `disableWhitelist` completely removes the whitelisting and enables all phoneline and group extensions.

```typescript
async function setLog(value: boolean): Promise<void>;
```

The `setLog` function toggles, the function to display all incoming and outgoing events, which have been sent to your `Incoming` and `Outgoing` Url.
These parameters can be set using these functions: `setIncomingUrl` and `setOutgoingUrl`.

### Webhooks

The webhook module provides the following features:

- subscribing to **newCall** events
- replying to **newCall** events with XML
- subscribing to **answer** events
- subscribing to **data** events
- subscribing to **hangup** events

**Please note:** The feature is only available in node.js environments and not available in browser environments

#### Structure

```typescript
interface WebhookModule {
	createServer: (port: number) => Promise<WebhookServer>;
}

type HandlerCallback<T, U> = (event: T) => U;

interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent, string>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent, void>) => void;
	onHangup: (fn: HandlerCallback<HangupEvent, void>) => void;
	onData: (fn: HandlerCallback<DataEvent, void>) => void;
	stop: () => void;
}
```

#### Creating the webhook server

By passing a `port` to the `createServer` method, you receive a `Promise<WebhookServer>`.
After the server has been instantiated, you can subscribe to various `Events` (`NewCallEvent`,`AnswerEvent`,`HangupEvent`,`DataEvent`) which are described below.

#### Subscribing to _newCall_ events

After creating the server, you can subscribe to newCall events by passing a callback function to the `.onNewCall` method. This callback function will receive a `NewCallEvent` (described below) when called and expects a valid XML response to be returned.
To receive any further `Events`, you can subscribe to them with the following XML:  
**Keep in mind:** you have to replace `https://www.sipgate.de/` with your server URL

```xml
<?xml version="1.0" encoding="UTF-8"?>
	<Response onAnswer="https://www.sipgate.de/" onHangup="https://www.sipgate.de/">
</Response>
```

```typescript
enum Direction {
	IN = 'in',
	OUT = 'out',
}

interface NewCallEvent {
	event: EventType;
	callId: string;
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
	event: EventType.NEW_CALL;
	originalCallId: string;
	user: string[];
	userId: string[];
	fullUserId: string[];
}
```

#### Replying to _newCall_ events with valid XML

You can return different `XML-Responses` in your callback, which will be passed to the PUSH-API:

##### Redirecting a call:

You can redirect the call to a specific phone number using the following XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Number>4915799912345</Number>
    </Dial>
</Response>
```

##### Sending a call to the voicemail:

Redirecting a call to the voicemail can be achieved by using the following XML snippet:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Voicemail />
    </Dial>
</Response>
```

##### Supressing your phone number and redirecting the call

The snippet mentioned below supresses your phone number and redirects you to a different number:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial anonymous="true">
        <Number>4915799912345</Number>
    </Dial>
</Response>
```

##### Set custom callerId and redirect the call

The custom `callerId` can be set to any validated number in your sipgate account:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial callerId="492111234567">
        <Number>4915799912345</Number>
    </Dial>
</Response>
```

##### Playing a sound file

**Please note:** Currently the sound file needs to be a mono 16bit PCM WAV file with a sampling rate of 8kHz. You can use conversion tools like the open source audio editor Audacity to convert any sound file to the correct format.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play>
        <Url>http://example.com/example.wav</Url>
    </Play>
</Response>
```

##### Gathering DTMF sounds

**Please note:** If you want to gather DTMF sounds, no future `onAnswer` and `onHangup` events will be pushed for the specific call.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather onData="http://localhost:3000/dtmf" maxDigits="3" timeout="10000">
        <Play>
            <Url>https://example.com/example.wav</Url>
        </Play>
    </Gather>
</Response>
```

##### Rejecting a call

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Reject />
</Response>
```

##### Rejecting a call like you are busy

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Reject reason="busy"/>
</Response>
```

##### Hangup calls

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Hangup />
</Response>
```

#### Subscribing to _onAnswer_ events

After creating the server, you can subscribe to onAnswer events by passing a callback function to the `.onAnswer` method. This callback function will receive a `AnswerEvent` (described below) when called and expects nothing to be returned.
To receive this event you have to subscribe to them with the XML mentioned in [Subscribing to **newCall** Events](#subscribing-to-newcall-events)

```typescript
interface AnswerEvent {
	callId: string;
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
	event: EventType.ANSWER;
	user: string;
	userId: string;
	fullUserId: string;
	answeringNumber: string;
	diversion?: string;
}
```

#### Subscribing to _data_ events

After creating the server, you can subscribe to onData events by passing a callback function to the `.onData` method. This callback function will receive a `DataEvent` (described below) when called and expects nothing to be returned.
To receive this event you have to subscribe to them with the XML mentioned in [Subscribing to **newCall** Events](#subscribing-to-newcall-events)

```typescript
interface DataEvent {
	callId: string;
	event: EventType.DATA;
	dtmf: string;
}
```

#### Subscribing to _hangup_ events

After creating the server, you can subscribe to onHangup events by passing a callback function to the `.onHangup` method. This callback function will receive a `HangupEvent` (described below) when called and expects nothing to be returned.
To receive this event you have to subscribe to them with the XML mentioned in [Subscribing to **newCall** Events](#subscribing-to-newcall-events)

```typescript
enum HangupCause {
	NORMAL_CLEARING = 'normalClearing',
	BUSY = 'busy',
	CANCEL = 'cancel',
	NO_ANSWER = 'noAnswer',
	CONGESTION = 'congestion',
	NOT_FOUND = 'notFound',
	FORWARDED = 'forwarded',
}

interface HangupEvent {
	callId: string;
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
	event: EventType.HANGUP;
	cause: HangupCause;
	answeringNumber: string;
}
```

### Contacts

The contacts module provides the following functions:

```typescript
interface ContactImport {
	firstname: string;
	lastname: string;
	address?: Address;
	phone?: PhoneNumber;
	email?: Email;
	organization?: string[];
}

interface ContactsModule {
	import: (contact: ContactImport, scope: Scope) => Promise<void>;
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string, scope: Scope) => Promise<void>;
	exportAsCsv: (scope: ExportScope, delimiter?: string) => Promise<string>;
	exportAsVCards: (scope: ExportScope) => Promise<string[]>;
	exportAsSingleVCard: (scope: ExportScope) => Promise<string>;
	exportAsObjects: (scope: ExportScope) => Promise<ContactRequest[]>;
}
```

#### The `import` method:

It takes a valid `ContactImport` Object and creates a Contact in the requested `Scope`.

#### The `importFromCsvString` method:

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

#### The `importVCardString` method:

It takes a valid VCard 4.0 string, containing at least the following fields:

- `name` contains `firstname` and `lastname`
- `number`

#### The `exportAsCsv` method:

It returns a csv strings containing all contacts for the given scope.  
You can also add a specific delimiter for the csv format.

#### The `exportAsVCards` method:

It returns mulitple vCard-strings containing all contacts for the given scope

#### The `exportAsSingleVCard` method:

It returns a vCard-address-book containing all contacts for the given scope

#### The `exportAsObjects` method:

It returns a list of contacts for the given scope as described in the following interface.

```typescript
interface ContactRequest {
	id: string;
	name: string;
	picture: string;
	emails: { email: string; type: string[] }[];
	numbers: { number: string; type: string[] }[];
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}
```

#### Scopes

The `PRIVATE` Scope contains all contacts created by yourself and not shared with other people.

The `SHARED` Scope includes all contacts created by anyone in your organization and are therefore shared with other people.

The `INTERNAL` Scope contains the contacts which are created by `sipgate` such as a contact for any `webuser` in your organization.

**Adress and Numbers**:

You can only save **one** address and **one** number using the Format.

## Examples

For some examples on how to use the library, please refer to this repository: [sipgateio-node-examples](https://github.com/sipgate-io/sipgateio-node-examples/)

```
npx ts-node some_example.ts
```

## Privacy Note

This library sets the following headers for every request made to the sipgate REST-API to obtain statistics about versions currently in use and to differentiate sipgate.io-users from sipgate software:

- X-Sipgate-Client
- X-Sipgate-Version
