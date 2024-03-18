## NEAR RELAY EXAMPLE

This repository approaches an extremly simple client/server relayer example.

### 1. Install packages
```
pnpm i
```
### 2. Run the relayer server
```
ts-node ./server.ts
```
### 3. Run a simple script to sign a transaction and send it to the relayer
```
ts-node ./client.ts
```


## Server
```typescript
app.post('/', async (req: Request, res: Response) => {
        //this endpoint receives an already signed serialized transaction from a client in the body which gets deserialized
        const serializedTx: Buffer = req.body;
        const deserializedTx: SignedDelegate = deserialize(SCHEMA.SignedDelegate, Buffer.from(serializedTx)) as SignedDelegate;
        //instantiate the wallet that is gonna be sending the delegated transaction
        const relayerAccount: Account = await getAccount(NETWORK_ID, RELAYER_ID, RELAYER_PRIVATE_KEY);
        //send the already signed transaction
        const receipt = await relayerAccount.signAndSendTransaction({
            actions: [actionCreators.signedDelegate(deserializedTx)],
            receiverId: deserializedTx.delegateAction.senderId
        });
        
        res.json({ message: 'Relayed', data: receipt });   
});
```


## Client

```typescript
async function sendRelay() {
  //build any smart contract call to be signed
  const action = actionCreators.functionCall(
    'set_greeting',
    {
        greeting: "hello"
   },);
  //get the account that is gonna sign the transaction   
  const account = await getAccount(NETWORK_ID, CLIENT_ID, CLIENT_PRIVATE_KEY);

  //use the special signedDelegate method to sign but not send the transaction  
  const signedDelegate = await account.signedDelegate({
    actions: [action],
    blockHeightTtl: 120,
    receiverId: CONTRACT_ID,
})
  //endode transaction and send it to the relayer server  
  const res = await fetch(SERVER_URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}

sendRelay()

```
The private key is in the client just as an example, be sure to keep private keys safe at all times.
