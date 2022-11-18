# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node) [![](https://data.jsdelivr.com/v1/package/gh/sipgate-io/sipgateio-node/badge)](https://www.jsdelivr.com/package/gh/sipgate-io/sipgateio-node)

A JavaScript library for [sipgate.io](https://www.sipgate.io/)

<!-- prettier-ignore -->
- [Installation](#installation)
- [Available Functionality](#available-functionality)
	- [SMS](#sms)
	- [Fax](#fax)
	- [Call](#call)
	- [Webhook (node.js only)](#webhook-nodejs-only)
	- [Webhook Settings](#webhook-settings)
	- [Fluent interface](#fluent-interface)
	- [Contacts](#contacts)
	- [History](#history)
	- [Numbers](#numbers)
	- [Real Time Call Manipulation (RTCM)](#real-time-call-manipulation-rtcm)
- [Usage](#usage)
	- [Creating a Client](#creating-a-client)
	- [SMS](#sms-1)
	- [Fax](#fax-1)
	- [Call](#call-1)
	- [Webhooks](#webhooks)
	- [Webhook Settings](#webhook-settings-1)
	- [Fluent interface](#fluent-interface-1)
	- [Contacts](#contacts-1)
	- [History](#history-1)
	- [Numbers](#numbers-1)
	- [Real Time Call Manipulation (RTCM)](#real-time-call-manipulation-rtcm-1)
	- [Voicemail](#voicemail)
	- [Device](#device)
- [Examples](#examples)
- [Changelog](#changelog)
- [Privacy Note](#privacy-note)
<!-- prettier-ignore -->

# Get Started

## Installation

For use in node applications you can install with

```console
npm install sipgateio --save
```

Alternatively, a bundled version can be obtained from the [github releases](https://github.com/sipgate-io/sipgateio-node/releases) page.  
Or use a CDN like jsDelivr instead:  
[https://cdn.jsdelivr.net/gh/sipgate-io/sipgateio-node@latest/bundle/sipgate-io.min.js](https://cdn.jsdelivr.net/gh/sipgate-io/sipgateio-node@latest/bundle/sipgate-io.min.js)

## Available Functionality

The following features are already implemented in the current version of this library:

### SMS

Send text messages, either instantly or scheduled. The caller ID can be set from the sipgate web interface, the default is the string "sipgate".

### Fax

Send any PDF file as a fax to a single number.

### Call

Initiate a call between two phones of your choice – no matter if inside your sipgate account or outside.

### Webhook (node.js only)

Set up a webserver to process real-time call data from sipgate.io.

### Webhook Settings

Configure the webhook functionality of sipgate.io. Currently, you can set URLs and whitelist extensions for triggering webhooks as well as toggle the debug log.

### Fluent interface

The fluent interface module is a wrapper for the webhook module to simplify its usage.

### Contacts

Import contacts in CSV format into your sipgate account.

### History

Fetch multiple or a specific event from your history.

### Numbers

Receive all numbers assigned to your account.

### Real Time Call Manipulation (RTCM)

Manipulate present calls that containts playing announcements with own audio-files. Also you can hangup, hold, mute an exist call and send DTMF singals.

## Usage

### Creating a Client

You can connect the client by passing a valid OAuth token (You have to implement the OAuth flow yourself). You can find more information on our [API documentation](https://www.sipgate.io/rest-api/authentication#oauth2).:

```typescript
const client = sipgateIO({
	token: '<valid Token>',
});
```

As alternative you can use personal access tokens to authenticate. You can find more information on our [API documentation](https://www.sipgate.io/rest-api/authentication#personalAccessToken).

```typescript
const client = sipgateIO({
	tokenId: '<your tokenId>',
	token: '<your personal access token>',
});
```

Possible authentication objects:

```typescript
interface OAuthCredentials {
	token: string;
}
```

```typescript
interface PersonalAccessTokenCredentials {
	tokenId: string;
	token: string;
}
```

The `sipgateIO` method accepts your valid sipgate credentials as defined in the `AuthCredentials` type and returns a sipgate.io Client.
The client contains as members the supported modules (`sms`, `fax`, `call`, etc.).

The client provides the following functions:

```typescript
async function getAuthenticatedWebuserId(): Promise<string>;
async function getWebUsers(): Promise<Webuser[]>;
```

The `getAuthenticatedWebuserId()` method returns the ID of the admin account.

The `getWebUsers()` method returns an array of the following type:

```typescript
export interface Webuser {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	defaultDevice: string;
	busyOnBusy: string;
	addressId: string;
	directDialIds: string[];
	timezone: string;
	admin: string;
}
```

**Note** that creating the sipgate.io Client will not validate your credentials, you might want to call the method `client.getAuthenticatedWebuserId()` to check that your credentials are correct.

### SMS

The SMS module provides the following functions:

```typescript
async function send(sms: ShortMessage): Promise<void>;
async function schedule(sms: ShortMessage, sendAt: Date): Promise<void>;
async function getSmsExtensions(webuserId: string): Promise<SmsExtension[]>;
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

The `getSmsExtensions` method returns an array of the following type:

```typescript
export interface SmsExtension {
	id: string;
	alias: string;
	callerId: string;
}
```

### Fax

The fax module provides the following functions:

```typescript
async function send(fax: Fax): Promise<SendFaxSessionResponse>;
async function getFaxStatus(sessionId: string): Promise<FaxStatus>;
async function getFaxlines(): Promise<Faxline[]>;
async function getFaxlinesByWebUser(webuserId: string): Promise<Faxline[]>;
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

With the `getFaxlines` function you can get a list of faxlines that belong to the currently authenticated user.
It returns an array of the following type:

```typescript
export interface Faxline {
	id: string;
	alias: string;
	tagline: string;
	canSend: boolean;
	canReceive: boolean;
}
```

With the `getFaxlinesByWebUser` function you can get a list of faxlines that belong to the specified user. It also returns an array of `Faxline`.

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

### Webhooks

**Please note:** The webhook feature is only available in node.js environments.

#### What is a webhook?

The Webhook API provides processing of real-time call data.  
A webhook is a POST request that sipgate.io makes to a predefined URL when a certain event occurs. These requests contain information about the event that occurred in application/x-www-form-urlencoded format.

The webhook module provides a simple means to set up a server for handling these webhooks.

The following types of events can trigger webhooks:

| EventType | Description                             |
| --------- | --------------------------------------- |
| NEW_CALL  | signals that a new call is ringing      |
| ANSWER    | signals that the call has been answered |
| HANGUP    | signals that the call has been hung up  |
| DATA      | signals dtmf tones sent in the call     |

For any of those events, a callback function can be registered to be called upon receiving the respective webhook.

Additionally, for the types `NEW_CALL` and `DATA` a response may be returned containing commands to trigger actions like hanging up or redirecting calls.

For generating that response our library provides a convenient [response interface](#sending-a-response).

#### Usage

To begin, instantiate the webhook module by calling `createWebhookModule`. The resulting object provides only one method, `createServer` which takes a configuration object of type `ServerOptions`.

```typescript
export interface ServerOptions {
	// the local port to listen on
	port: number;
	// the publicly accessible server address
	// (including the port, if not standard)
	serverAddress: string;
	// an optional hostname (default: localhost)
	hostname?: string;
	// you can optionally skip the signature verification
	skipSignatureVerification?: boolean;
}
```

It returns a `Promise<WebhookServer>` which, when resolved, provides the following methods:

```typescript
interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent, ResponseObject | void>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent, void>) => void;
	onHangup: (fn: HandlerCallback<HangUpEvent, void>) => void;
	onData: (fn: HandlerCallback<DataEvent, ResponseObject | void>) => void;
	stop: () => void;
}
```

The `stop` method simply kills the server, the other methods each take a callback function for handling the respective types of events suggested by their name.

#### Security

Webhooks are verified to ensure that they are sent by sipgate.\
You can optionally disable this via the `skipSignatureVerification` flag.

Additionaly you can check that webhooks are originated from push-api.sipgate.net (217.116.118.254).

#### Registering event callbacks

Each of the four callback registration methods takes a single callback function that accepts a webhook object of the respective type (i.e. `NewCallEvent`, `AnswerEvent`, `HangUpEvent`, or `DataEvent`). In the case of `onNewCall` and `onData` the provided function may return a `ResponseObject` (details [below](#webhookresponse-builder))

Within the callback function the following fields are accessible:

#### All event types

##### NewCall

The `NewCallEvent` type offers the following fields:

| Parameter        | Description                                                                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event`          | `EventType.NEW_CALL`                                                                                                                                                                                                                                                    |
| `from`           | The calling number (e.g. `"492111234567"` or `"anonymous"`)                                                                                                                                                                                                             |
| `to`             | The called number (e.g. `"4915791234567"`)                                                                                                                                                                                                                              |
| `direction`      | The direction of the call (either `"in"` or `"out"`)                                                                                                                                                                                                                    |
| `callId`         | A unique alphanumeric identifier to match events to specific calls.                                                                                                                                                                                                     |
| `originalCallId` | A unique alphanumeric identifier to match events to specific calls across transfers.                                                                                                                                                                                    |
| `user`           | The sipgate user(s) involved. It is the name of the calling user when direction is `"out"`, or of the users receiving the call when direction is `"in"`. Group calls may be received by multiple users. In that case a `user` parameter is set for each of these users. |
| `userId`         | The IDs of sipgate user(s) involved (e.g. `"w0"`).                                                                                                                                                                                                                      |
| `fullUserId`     | The full IDs of sipgate user(s) involved (e.g. `"1234567w0"`).                                                                                                                                                                                                          |
| `xcid`           | Another unique alphanumeric identifier to match events to specific calls                                                                                                                                                                                                |

##### Answer

the `AnswerEvent` type offers the following fields:

| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `event`           | `EventType.ANSWER`                                                                              |
| `from`            | The calling number (e.g. `"492111234567"` or `"anonymous"`)                                     |
| `to`              | The called number (e.g. `"4915791234567"`)                                                      |
| `direction`       | The direction of the call (either `"in"` or `"out"`)                                            |
| `callId`          | A unique alphanumeric identifier to match events to specific calls.                             |
| `originalCallId`  | A unique alphanumeric identifier to match events to specific calls across transfers.            |
| `user`            | Name of the user who answered this call. Only incoming calls can have this parameter            |
| `userId`          | The IDs of sipgate user(s) involved (e.g. `"w0"`).                                              |
| `fullUserId`      | The full IDs of sipgate user(s) involved (e.g. `"1234567w0"`).                                  |
| `answeringNumber` | The number of the answering destination. Useful when redirecting to multiple destinations       |
| `diversion`       | If a call was diverted before it reached sipgate.io this contains the originally dialed number. |
| `xcid`            | Another unique alphanumeric identifier to match events to specific calls                        |

##### HangUp

the `HangUpEvent` type offers the following fields:

| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `event`           | `EventType.HANGUP`                                                                              |
| `from`            | The calling number (e.g. `"492111234567"` or `"anonymous"`)                                     |
| `to`              | The called number (e.g. `"4915791234567"`)                                                      |
| `direction`       | The direction of the call (either `"in"` or `"out"`)                                            |
| `callId`          | Same as in `NewCallEvent` for a specific call                                                   |
| `originalCallId`  | A unique alphanumeric identifier to match events to specific calls across transfers.            |
| `cause`           | The cause for the hangup event (see [table](#hangup-causes) below)                              |
| `answeringNumber` | The number of the answering destination. Useful when redirecting to multiple destinations       |
| `diversion`       | If a call was diverted before it reached sipgate.io this contains the originally dialed number. |
| `xcid`            | Another unique alphanumeric identifier to match events to specific calls                        |

###### Hangup causes

Hangups can occur due to these causes:

| Cause              | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `"normalClearing"` | One of the participants hung up after the call was established  |
| `"busy"`           | The called party was busy                                       |
| `"cancel"`         | The caller hung up before the called party picked up            |
| `"noAnswer"`       | The called party rejected the call (e.g. through a DND setting) |
| `"congestion"`     | The called party could not be reached                           |
| `"notFound"`       | The called number does not exist or called party is offline     |
| `"forwarded"`      | The call was forwarded to a different party                     |

##### Data

the `DataEvent` type offers the following fields:

| Parameter        | Description                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `event`          | `EventType.DATA`                                                                         |
| `callId`         | Same as in `NewCallEvent` for a specific call                                            |
| `originalCallId` | A unique alphanumeric identifier to match events to specific calls across transfers.     |
| `dtmf`           | Digit(s) the user has entered. If no input is received, the value of dtmf will be empty. |

##### Sending a response

For composing an XML response from withing a callback function our library offers a convenient response interface:

```typescript
interface WebhookResponseInterface {
	redirectCall: (redirectOptions: RedirectOptions) => RedirectObject;
	sendToVoicemail: () => VoicemailObject;
	rejectCall: (rejectOptions: RejectOptions) => RejectObject;
	playAudio: (playOptions: PlayOptions) => PlayObject;
	playAudioAndTransfer: (
		playOptions: PlayOptions,
		transferOptions: TransferOptions,
		client: SipgateIOClient,
		callId: string,
		timeout?: number
	) => Promise<PlayObject>;
	playAudioAndHangUp: (
		playOptions: PlayOptions,
		client: SipgateIOClient,
		callId: string,
		timeout?: number
	) => Promise<PlayObject>;
	gatherDTMF: (gatherOptions: GatherOptions) => GatherObject;
	hangUpCall: () => HangUpObject;
}
```

##### Redirecting calls

The `redirectCall` method accepts an options object of type `RedirectOptions` with the following fields:

```typescript
type RedirectOptions = {
	numbers: string[];
	anonymous?: boolean;
	callerId?: string;
};
```

##### Sending calls to voicemail

The `sendToVoicemail` method accepts no further options.

##### Rejecting calls

The `rejectCall` method accepts an options object of type `RejectOptions` with a single field, the reason for rejecting the call. This reason may be one of the following:

```typescript
enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}
```

##### Play audio

The `playAudio` method accepts an options object of type `PlayOptions` with a single field, the URL to a sound file to be played.

**Note:** Currently the sound file needs to be a mono 16bit PCM WAV file with a sampling rate of 8kHz. You can use conversion tools like the open source audio editor Audacity to convert any sound file to the correct format.

Linux users might want to use mpg123 to convert the file:

```shell
mpg123 --rate 8000 --mono -w output.wav input.mp3
```

##### Play audio and hang up

The `playAudioAndHangUp` method accepts an options object of type `PlayOptions` with a single field, the URL to a sound file to be played.
In addition, this also requires a `sipgateIOClient`, a unique `callId` from an current active call and a `timeout` which is optional.

After the audio file has been played and the additional timeout has expired, the call is terminated based on the `callId`.

**Note:** For any information about the audio file please look at [play audio](#play-audio).

##### Play audio and transfer

The `playAudioAndTransfer` method accepts an options object of type `PlayOptions` with a single field, the URL to a sound file to be played, and an object of type `TransferOptions`, which contains the phone number to which the call should be transferred.
In addition, this also requires a `sipgateIOClient`, a unique `callId` from an current active call and a `timeout` which is optional.

After the audio file has been played and the additional timeout has expired, the call is terminated based on the `callId`.

**Note:** For any information about the audio file please look at [play audio](#play-audio).

##### Gather DTMF tones

The `gatherDTMF` method accepts an options object of type `GatherOptions` with the following fields:

```typescript
type GatherOptions = {
	announcement?: string;
	maxDigits: number;
	timeout: number;
};
```

`maxDigits` (> = 1) specifies to maximum number of DTMF tones to be gathered , the `timeout` (> = 0) is the period in milliseconds to wait for DTMF input from a caller before processing. Please note that the establishment of the call is delayed until this period has elapsed.
By specifying a URL to a sound file as `announcement` an audio message can be played to inform callers what DTMF tones they should send.

**Note:** Please consider the above restrictions concerning the format of the announcement file.

##### Hang up calls

The `hangUpCall` method accepts no further options.

### Webhook Settings

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

```typescript
interface WebhookSettings {
	incomingUrl: string;
	outgoingUrl: string;
	log: boolean;
	whitelist: string[] | null;
}

async function getWebhookSettings(): Promise<WebhookSettings>;
```

The `getWebhookSettings` function returns you the current settings of sipgate.io including the incoming/outgoing URL, whether logging is enabled or if a specific whitelist of devices is set for your incoming & outgoing URL.

### Fluent interface

The fluent interface module currently provides a wrapper for the following functions of the webhook module:

- port
- serverAddress
- AnswerCallback
- DataCallback
- HangUpCallback
- NewCallCallback
- startServer

Example:

```typescript
new FluentWebhookServer()
	.setServerPort(port)
	.setServerAddress(serverAddress)
	.setOnNewCallListener((newCallEvent) => {
		console.log(`New call from ${newCallEvent.from} 	to ${newCallEvent.to}`);
	})
	.setOnAnswerListener((answerEvent) => {
		console.log(`Answer from: ${answerEvent.from}`);
	})
	.setOnHangupListener((hangupEvent) => {
		console.log(`Hangup with cause: ${hangupEvent.cause}`);
	})
	.setOnDataListener((dataEvent) => {
		console.log(`Data from Call: ${dataEvent.originalCallId}`);
	})
	.startServer();
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

type ContactUpdate = ContactResponse;

interface ContactResponse {
	id: string;
	name: string;
	picture: string;
	emails: Email[];
	numbers: PhoneNumber[];
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}

interface ContactsModule {
	create: (contact: ContactImport, scope: Scope) => Promise<void>;
	update: (contact: ContactUpdate) => Promise<void>;
	delete: (id: string) => Promise<void>;
	deleteAllPrivate: () => Promise<void>;
	deleteAllShared: () => Promise<void>;
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string, scope: Scope) => Promise<void>;
	exportAsCsv: (
		scope: ExportScope,
		delimiter?: string,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	exportAsVCards: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string[]>;
	exportAsSingleVCard: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	get: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<ContactResponse[]>;
}
```

#### The `create` method:

Given a `ContactImport` and `Scope`, creates a contact.

#### The `update` method:

Takes a `ContactResponse`, the output of `ContactsModule.get`, and updates the corresponding contact.

#### The `delete` method:

Deletes a contact by a given id.

#### The `deleteAllPrivate` method:

Deletes all private contacts.

#### The `deleteAllShared` method:

Deletes all shared contacts.

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

**Note:** using a filter will ignore pagination

#### The `exportAsJSON` method:

It returns JSON objects containing all contacts for the given scope.

**Note:** using a filter will ignore pagination

#### The `exportAsVCards` method:

It returns mulitple vCard-strings containing all contacts for the given scope

**Note:** using a filter will ignore pagination

#### The `exportAsSingleVCard` method:

It returns a vCard-address-book containing all contacts for the given scope

**Note:** using a filter will ignore pagination

#### The `exportAsObjects` method:

It returns a list of contacts for the given scope as described in the following interface.

**Note:** using a filter will ignore pagination

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

### History

The history module provides functionality to fetch all or specific history events.

```typescript
interface HistoryModule {
	fetchAll: (
		filter?: HistoryFilter,
		pagination?: Pagination
	) => Promise<HistoryEntry[]>;
	fetchById: (entryId: string) => Promise<HistoryEntry>;
	deleteByListOfIds: (entryIds: string[]) => Promise<void>;
	deleteById: (entryId: string) => Promise<void>;
	batchUpdateEvents: (
		events: HistoryEntry[],
		callback: (entry: HistoryEntry) => HistoryEntryUpdateOptions
	) => Promise<void>;
	exportAsCsvString: (
		filter?: BaseHistoryFilter,
		pagination?: Pagination
	) => Promise<string>;
}
```

#### The `fetchAll` method:

The fetchAll method can filter the result by using the 'HistoryFilter' interface. You can decide how many history events you receive by adjusting the values in the pagination object.

```typescript
interface HistoryFilter {
	connectionIds?: string[];
	types?: HistoryEntryType[];
	directions?: Direction[];
	archived?: boolean;
	starred?: boolean;
	from?: Date;
	to?: Date;
	phonenumber?: string;
}

interface Pagination {
	offset?: number;
	limit?: number;
}
```

`fetchById` and `fetchAll` methods returns one or multiple history events described by the following base-structure:

```typescript
interface BaseHistoryEntry {
	id: string;
	source: string;
	target: string;
	sourceAlias: string;
	targetAlias: string;
	type: HistoryEntryType;
	created: Date;
	lastModified: Date;
	direction: Direction;
	incoming: boolean;
	status: string;
	connectionIds: string[];
	read: boolean;
	archived: boolean;
	note: string;
	endpoints: RoutedEndpoint[];
	starred: boolean;
	labels: string[];
}
```

There are multiple event-types, such as:  
`CallHistoryEntry`, `FaxHistoryEntry`, `SmsHistoryEntry`, `VoicemailHistoryEntry`.  
A more detailed description of these types can be found [here](/lib/history/history.types.ts).

#### The `batchUpdateEvents` function

You have to pass events, which should be updated, to the `batchUpdateEvents` function. The second parameter is a mapping function which gives you the ability to return `HistoryEntryUpdateOptions` for every event which is used to set the specified parameters in the history entry.

```typescript
export interface HistoryEntryUpdateOptions {
	archived?: boolean;
	starred?: boolean;
	note?: string;
	read?: boolean;
}
```

#### History deletion

The `deleteById` method allows you to delete an history entry with the given id.

The `deleteByListOfIds` method allows you to delete multiple history entries by a given list of ids.

#### The `exportAsCsvString` method

The `exportAsCsvString` method allows you to export your history entries as a csv string.
Optionally you can filter and paginate the response by using the following parameters:

```typescript
export interface BaseHistoryFilter {
	connectionIds?: string[];
	types?: HistoryEntryType[];
	directions?: HistoryDirection[];
	archived?: boolean;
	starred?: boolean;
	startDate?: Date;
	endDate?: Date;
}

interface Pagination {
	offset?: number;
	limit?: number;
}
```

### Numbers

The numbers module provides the following function:

```typescript
interface NumbersModule {
	getAllNumbers: (pagination?: Pagination) => Promise<NumberResponseItem[]>;
}
```

#### The `getAllNumbers` method:

The method returns an array of objects with the type `NumberResponseItem`, which has the following structure:

```typescript
interface NumberResponseItem {
	id: string;
	number: string;
	localized: string;
	type: NumberResponseItemType;
	endpointId: string;
	endpointAlias: string;
	endpointUrl: string;
	mnpState?: NumberMnpState;
	portId?: number;
}
```

Where `NumberResponseItemType` is one value out of the following enum:

```typescript
enum NumberResponseItemType {
	MOBILE = 'MOBILE',
	LANDLINE = 'LANDLINE',
	QUICKDIAL = 'QUICKDIAL',
	INTERNATIONAL = 'INTERNATIONAL',
}
```

The `mnpState` of type `NumberMnpState` only appears in a mobile number entry and looks like this:

```typescript
interface NumberMnpState {
	isReleased: boolean;
	releasedUntil: Date;
}
```

### Real Time Call Manipulation (RTCM)

The real time call manipulation module provides the following functions:

```typescript
interface RTCMModule {
	getEstablishedCalls: () => Promise<RTCMCall[]>;
	mute: (call: RTCMCall, status: boolean) => Promise<void>;
	record: (call: RTCMCall, recordOptions: RecordOptions) => Promise<void>;
	announce: (call: RTCMCall, announcement: string) => Promise<void>;
	transfer: (call: RTCMCall, transferOptions: TransferOptions) => Promise<void>;
	sendDTMF: (call: RTCMCall, sequence: string) => Promise<void>;
	hold: (call: RTCMCall, status: boolean) => Promise<void>;
	hangUp: (call: RTCMCall) => Promise<void>;
}
```

The structure of a present call is provided by a `RTCMCall` and containts the following attributes:

```typescript
interface RTCMCall {
	callId: string;
	muted: boolean;
	recording: boolean;
	hold: boolean;
	participants: Participant[];
}

interface Participant {
	participantId: string;
	phoneNumber: string;
	muted: boolean;
	hold: boolean;
	owner: boolean;
}
```

#### The `getEstablishedCalls` method:

It returns all present calls of this account and return an array of `RTCMCall`.

#### The `mute` method:

You can pass a `RTCMCall` and set your microphone muted or unmuted.

#### The `record` method:

You can start or stop a recording and find this later in the history entry.

#### The `announce` method:

You can play an audiofile that needs to be a mono 16bit PCM WAV file with a sampling rate of 8kHz. Insert the URL of this audiofile as parameter in the announcment.

#### The `transfer` method:

You can attend a call and transfer it to a phonenumber with the following structure:

```typescript
interface TransferOptions {
	attended: boolean;
	phoneNumber: string;
}
```

#### The `sendDTMF` method:

You can send a sequence of valid DTMFs digits to the passed call.

#### The `hold` method:

You can hold and continue a present call.

#### The `hangUp` method:

You can abort or terminate a current call.

### Voicemail

The voicemail module provides the following functions:

```typescript
async function getVoicemails(): Promise<Voicemail[]>;
```

The `getVoicemails` method returns an array of the following type:

```typescript
export interface Voicemail {
	id: string;
	alias: string;
	belongsToEndpoint: {
		extension: string;
		type: string;
	};
}
```

### Device

The device module provides the following functions:

```typescript
async function getDevices(webuserId: string): Promise<Device[]>;
```

The `getDevices` method returns an array of the following type:

```typescript
export type DeviceType = 'REGISTER' | 'MOBILE' | 'EXTERNAL';

export interface ActiveRouting {
	id: string;
	alias: string;
}

export interface Device {
	id: string;
	alias: string;
	type: DeviceType;
	dnd: boolean;
	online: boolean;
	callerId?: string;
	owner?: string;
	activePhonelines: ActiveRouting[];
	activeGroups: ActiveRouting[];
}
```

## Examples

For some examples on how to use the library, please refer to this repository: [sipgateio-node-examples](https://github.com/sipgate-io/sipgateio-node-examples/)

```
npx ts-node some_example.ts
```

## Changelog

You can find the changelog [here](./CHANGELOG.md).

## Privacy Note

This library sets the following headers for every request made to the sipgate REST-API to obtain statistics about versions currently in use and to differentiate sipgate.io-users from sipgate software:

- X-Sipgate-Client
- X-Sipgate-Version
