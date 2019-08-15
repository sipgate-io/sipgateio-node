# sipgateio-node [![Build Status](https://travis-ci.com/sipgate-io/sipgateio-node.svg?branch=master)](https://travis-ci.com/sipgate-io/sipgateio-node)

The sipgate.io Node.js library

### Download

`git clone https://github.com/sipgate-io/sipgateio-node`

### Methods

#### createClient(username, password)

```typescript
const client = createClient(<your email-adress>, <your password>);
```

The Create Client Method returns a sipgate.io-Client after passing your valid sipgate.io-Credentials

### Methods (client)

You can use the SMS Module to send an SMS to any recipient in the following way:

##### sample:

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
