import * as anchor from '@project-serum/anchor';
import * as serumAssoToken from "@project-serum/associated-token";
import * as splToken from "@solana/spl-token";
import * as srmCmn from "@project-serum/common";
describe('ata', () => {
  let provider = anchor.Provider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);
  let program = anchor.workspace.Ata;

  let testTokenMint: anchor.web3.PublicKey;
  it("creates test tokens", async () => {
    testTokenMint = await srmCmn.createMint(provider)
  })
  let associatedTokenOne: anchor.web3.PublicKey;
  let associatedTokenTwo: anchor.web3.PublicKey;
  it("creates associated token address (ATA-1 & ATA-2)", async() => {
    associatedTokenOne = await createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      testTokenMint,
    )
    associatedTokenTwo = await createAssociatedTokenAccount(
      provider,
      associatedTokenOne,
      testTokenMint,
    )
  })
  it("initialize", async () => {
    await program.rpc.initialize({})
  })
  it("runs function", async () => {
    const tx = await program.rpc.run({
      accounts: {
        authority: provider.wallet.publicKey,
        firstAta: associatedTokenOne,
        secondAta: associatedTokenTwo,
        tokenMint: testTokenMint,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
      }
    });
    console.log("Your transaction signature", tx);
  });
});


export async function createAssociatedTokenAccount(
  provider: anchor.Provider, // payer
  owner: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  let txs = new anchor.web3.Transaction();
  txs.add(
    await serumAssoToken.createAssociatedTokenAccount(
      provider.wallet.publicKey,
      owner,
      mint
    )
  );
  await provider.send(txs);
  let acct = await serumAssoToken.getAssociatedTokenAddress(owner, mint);
  return acct;
}

