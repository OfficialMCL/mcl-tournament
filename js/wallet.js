
const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      console.log('Connected:', response.publicKey.toString());
      alert('Wallet connected: ' + response.publicKey.toString());
    } catch (err) {
      if (err.code === 4001) {
        alert('Connection request rejected by user.');
      } else {
        console.error(err);
        alert('Error connecting to wallet.');
      }
    }
  } else {
    alert('Phantom Wallet not found. Please install the extension and try again.');
  }
});
