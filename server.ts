import { InMemoryKeyStore } from "@near-js/keystores";
import { JsonRpcProvider } from "@near-js/providers";
import {KeyPair} from '@near-js/crypto'
import {InMemorySigner} from '@near-js/signers'
import { Account } from "@near-js/accounts";
import { deserialize} from "borsh";
import { SCHEMA, SignedDelegate, actionCreators } from "@near-js/transactions";
export const { signedDelegate } = actionCreators;
import 'dotenv/config'

const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json());
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.post('/', async (req: any, res: any) => {
    const body = req.body;

    const deserializeDelegate = deserialize(
        SCHEMA.SignedDelegate,
        Buffer.from(new Uint8Array(body))
      ) as SignedDelegate;
      
    const relayerAccount = await getRelayer();
    
    const action = signedDelegate(deserializeDelegate)


    const result = await relayerAccount.signAndSendTransaction({
    actions: [action],
    receiverId: deserializeDelegate.delegateAction.senderId,
    });   
    
    res.json({ message: 'Relayed', data: result });
});


 async function getRelayer(){

    const NETWORK: any = process?.env?.NEAR_NETWORK 
    const RELAYER_ACCOUNT_ID: any = process?.env?.RELAYER_ACCOUNT_ID
    const RELAYER_PRIVATE_KEY: any = process?.env?.RELAYER_PRIVATE_KEY
    
    const provider = new JsonRpcProvider({
        url: `https://rpc.${NETWORK}.near.org`,
    });
  
    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(NETWORK, RELAYER_ACCOUNT_ID, KeyPair.fromString(RELAYER_PRIVATE_KEY));

    const signer = new InMemorySigner(keyStore);

      return new Account(
      {
        networkId: NETWORK,
        provider,
        signer,
        jsvmAccountId: "",
      },
      RELAYER_ACCOUNT_ID
    );
  }
