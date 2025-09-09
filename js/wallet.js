
// Check if Phantom Wallet is installed
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      // Request wallet connection
      const resp = await window.solana.connect();
      console.log('Wallet connected:', resp.publicKey.toString());
      alert('Wallet connected: ' + resp.publicKey.toString());
      // You can use resp.publicKey for further operations
    } catch (err) {
      if (err.code === 4001) {
        // User closed or rejected the connection request
        console.log('Wallet connection cancelled by the user.');
        alert('Wallet connection cancelled. Please try again by clicking the button.');
      } else {
        console.error('Error during connection:', err);
        alert('An error occurred while connecting to the wallet.');
      }
    }
  } else {
    alert('Phantom Wallet is not installed. Please install it from https://phantom.app/');
  }
};

// Attach event to button
document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
