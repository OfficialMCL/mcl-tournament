<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Connect Solana Wallet</title>
</head>
<body>
  <button id="connectWalletBtn">Connect Solana Wallet</button>

  <script>
    const connectButton = document.getElementById('connectWalletBtn');

    connectButton.addEventListener('click', async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          // Request connection
          const response = await window.solana.connect();
          alert('Connected with public key: ' + response.publicKey.toString());
        } catch (err) {
          if (err.code === 4001) {
            alert('Connection request rejected by user.');
          } else {
            alert('Error connecting to wallet.');
          }
        }
      } else {
        alert('Phantom Wallet not found. Please install it.');
      }
    });
  </script>
</body>
</html>
