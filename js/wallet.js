
// Check if Phantom Wallet is installed
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      // Request wallet connection
      const resp = await window.solana.connect();
      console.log('Wallet connected:', resp.publicKey.toString());
      alert('Wallet connected: ' + resp.publicKey.toString());
      // You can now use resp.publicKey for further operations
    } catch (err) {
      console.error('Connection rejected or failed', err);
    }
  } else {
    alert('Phantom Wallet is not installed. Please install it from https://phantom.app/');
  }
};

// Attach event to button
document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
