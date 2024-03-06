import { InMemoryKeyStore } from "@near-js/keystores";
import { KeyPair } from '@near-js/crypto'
import { connect } from "near-api-js";
import { actionCreators, encodeSignedDelegate } from "@near-js/transactions";
//@ts-ignore
import BN from "bn.js";


async function sendRelay() {
  const action = actionCreators.functionCall(
    'set_greeting',
    {
        greeting: "hello"
   },
    new BN("200000000000000"),
    new BN("10000000000000000000000")
  );

  const account = await getAccount();

  const signedDelegate = await account.signedDelegate({
    actions: [action],
    blockHeightTtl: 120,
    receiverId: 'hello.near-examples.near',
})
  const res = await fetch('http://localhost:5000/', {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
    headers: new Headers({ "Content-Type": "application/json" }),
  });
  console.log(res)

}


 async function getAccount(){
    
      const accountId = 'emailtest.near'
      const privateKey = 'ed25519:21tVVr6VyiMUpJEPj6k9bpSChDnGj1hZsEtBaKpzSEgiK1suRSjtpZDphiUebVmLD4mDrLfMCRLDkWdtA52kbpV4'
      const network = 'mainnet'

      const keyStore = new InMemoryKeyStore();
      await keyStore.setKey(network, accountId, KeyPair.fromString(privateKey));
  
      const config = {
        keyStore,
        networkId: 'mainnet',
        nodeUrl: 'https://beta.rpc.mainnet.near.org'
      };
      
      const near = await connect(config);
      return await near.account(accountId);

}


  sendRelay();

