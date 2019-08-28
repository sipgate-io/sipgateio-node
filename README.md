# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

The sipgate.io Node.js library

### Download

`git clone https://github.com/sipgate-io/sipgateio-node`

### Methods

#### createClient(username, password)

```typescript
const client = createClient(<your email-adress>, <your password>);
```

The Create Client Method returns a sipgate.io-Client after passing your valid sipgate.io-Credentials.

### Available Functionality

You can use the SMS Module to send an SMS to any recipient in the following way:

##### SMS Example:

```typescript
const recipient = '<your phone number>';
const smsId = '<your sms extension>';
const message = '<your short message>';

client.sms
  .send({ recipient, smsId, message })
  .then(() => {
    console.log('Sms sent.');
  })
  .catch(error => {
    console.error(error);
  });
```

You can use the Fax Module to send a Fax to any recipient in the following way:

##### Fax Example:

```typescript
const fax: Fax = {
  filename: '<path to your pdf-file>',
  recipient: "<recipients's faxnumber>",
};

client.fax
  .send(fax)
  .then(() => {
    console.log('Fax sent');
  })
  .catch(error => {
    console.error(error.message);
  });
```

You can also provide a faxlineId to specify which faxline should be used otherwise the library will use the first faxlineId it receives from your list of registered faxlines.

```typescript
const fax: Fax = {
  filename: '<path to your pdf-file>',
  recipient: "<recipients's faxnumber>",
  faxlineId: '<your faxlineId>',
};
```
