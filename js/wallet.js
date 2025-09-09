// Function to connect Phantom wallet with state check and error handling
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    if (window.solana.isConnected) {
      alert('Wallet is already connected: ' + window.solana.publicKey.toString());
      return;
    }
    try {
      const resp = await window.solana.connect();
      alert('Wallet connected: ' + resp.publicKey.toString());
    } catch (err) {
      if (err.code === 4001) {
        alert('Connection rejected. Please try again.');
      } else {
        alert('An error occurred during wallet connection.');
      }
    }
  } else {
    alert('Phantom Wallet not detected. Please install the extension.');
  }
};

// Function to disconnect Phantom wallet
const disconnectWallet = async () => {
  if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
    await window.solana.disconnect();
    alert('Wallet disconnected.');
  } else {
    alert('No wallet connected.');
  }
};
