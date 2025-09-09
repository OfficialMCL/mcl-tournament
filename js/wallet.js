document.getElementById('connectButton').addEventListener('click', async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      // Richiesta di connessione al wallet Phantom
      const resp = await window.solana.connect();
      console.log('Connected with public key:', resp.publicKey.toString());
      // Puoi usare resp.publicKey per aggiornare l'interfaccia o inviarla al server
    } catch (err) {
      console.error('User rejected the connection or error:', err);
    }
  } else {
    alert('Phantom wallet non rilevato. Per favore installalo da https://phantom.app/');
  }
});
