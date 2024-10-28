import { actionCreators, encodeSignedDelegate } from '@near-js/transactions';
import { getAccount } from './util';

const CLIENT_ID = 'the-user.testnet';
const CLIENT_PRIVATE_KEY =
  'ed25519:4PcuqzFyK8yas151xKBoBbUe5DLCd4RcpekW5rjKTsUtabkvGqwacgmnBECDdzEQAvozG5spguF2yp5knjNjDHAt';
const NETWORK_ID = 'testnet';
const CONTRACT_ID = 'hello.near-examples.testnet';
const SERVER_URL = 'http://localhost:5000/';

async function sendRelay() {
  const action = actionCreators.functionCall(
    'set_greeting',
    {
      greeting: 'hello',
    },
    '3000000000000',
  );

  const account = await getAccount(NETWORK_ID, CLIENT_ID, CLIENT_PRIVATE_KEY);

  const signedDelegate = await account.signedDelegate({
    actions: [action],
    blockHeightTtl: 120,
    receiverId: CONTRACT_ID,
  });
  const res = await fetch(SERVER_URL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify([Array.from(encodeSignedDelegate(signedDelegate))]),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
}

sendRelay();
