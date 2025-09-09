async function connectPhantomWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      console.log('Wallet connected:', response.publicKey.toString());
      alert('Wallet connected: ' + response.publicKey.toString());
      // You can update your UI here to show the connected wallet address
    } catch (error) {
      // Handle when user closes the popup or rejects the connection
      if (error.code === 4001) { // 4001 is the user rejected error code
        alert('Connection request was rejected. Please click Connect Wallet to try again.');
      } else {
        alert('Connection failed: ' + error.message);
      }
      console.error('Connection error:', error);
    }
  } else {
    alert('Phantom Wallet not found. Please install it.');
  }
}

// Attach the event listener safely after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const connectButton = document.getElementById('connectWalletBtn');
  if (connectButton) {
    connectButton.addEventListener('click', () => [
      connectPhantomWallet();
  });
}
});
