import { Account } from "@near-js/accounts";
import { InMemoryKeyStore } from "@near-js/keystores";
import { KeyPair, connect } from "near-api-js";

export async function getAccount(network: string, accountId: string, privateKey: string): Promise<Account> {
    const keyStore: InMemoryKeyStore = new InMemoryKeyStore();
    await keyStore.setKey(network, accountId, KeyPair.fromString(privateKey));

    const config = {
        networkId: network,
        keyStore,
        nodeUrl: `https://rpc.${network}.near.org`,
    };

    const near = await connect(config);
    return near.account(accountId);
}