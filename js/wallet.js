// Wallet connection and Solana integration
// Handles Phantom wallet connection and blockchain interactions

class MCLWallet {
    constructor() {
        this.wallet = null;
        this.connection = null;
        this.isConnected = false;
        this.balance = 0;
        this.mclBalance = 0;
        
        this.initConnection();
    }
    
    async initConnection() {
        try {
            // Connect to Solana devnet for testing (change to mainnet for production)
            this.connection = new solanaWeb3.Connection(
                'https://api.devnet.solana.com',
                'confirmed'
            );
        } catch (error) {
            console.error('Error initializing Solana connection:', error);
        }
    }
    
    async connectWallet() {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                throw new Error('Phantom wallet not found');
            }
            
            const response = await window.solana.connect();
            this.wallet = response.publicKey;
            this.isConnected = true;
            
            // Get wallet balance
            await this.updateBalance();
            
            return {
                success: true,
                publicKey: this.wallet.toString(),
                balance: this.balance
            };
            
        } catch (error) {
            console.error('Wallet connection error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updateBalance() {
        if (!this.wallet || !this.connection) return;
        
        try {
            // Get SOL balance
            const balance = await this.connection.getBalance(this.wallet);
            this.balance = balance / solanaWeb3.LAMPORTS_PER_SOL;
            
            // Get MCL token balance (placeholder - replace with actual MCL token mint)
            // this.mclBalance = await this.getTokenBalance('MCL_TOKEN_MINT_ADDRESS');
            
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    }
    
    async getTokenBalance(mintAddress) {
        if (!this.wallet || !this.connection) return 0;
        
        try {
            const tokenAccounts = await this.connection.getTokenAccountsByOwner(
                this.wallet,
                { mint: new solanaWeb3.PublicKey(mintAddress) }
            );
            
            if (tokenAccounts.value.length === 0) return 0;
            
            const tokenAccountInfo = await this.connection.getTokenAccountBalance(
                tokenAccounts.value[0].pubkey
            );
            
            return tokenAccountInfo.value.uiAmount || 0;
            
        } catch (error) {
            console.error('Error getting token balance:', error);
            return 0;
        }
    }
    
    async sendVote(coinChoice, amount, currency = 'SOL') {
        if (!this.isConnected || !this.wallet) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // Create vote transaction
            const transaction = new solanaWeb3.Transaction();
            
            if (currency === 'SOL') {
                // Send SOL to voting contract
                const votingWallet = new solanaWeb3.PublicKey('VOTING_CONTRACT_ADDRESS'); // Replace with actual address
                
                const instruction = solanaWeb3.SystemProgram.transfer({
                    fromPubkey: this.wallet,
                    toPubkey: votingWallet,
                    lamports: amount * solanaWeb3.LAMPORTS_PER_SOL
                });
                
                transaction.add(instruction);
            } else {
                // Handle MCL token transfer
                // Add SPL token transfer instruction here
            }
            
            // Add vote data as memo
            const voteData = JSON.stringify({
                coin: coinChoice,
                amount: amount,
                currency: currency,
                timestamp: Date.now()
            });
            
            transaction.add(
                new solanaWeb3.TransactionInstruction({
                    keys: [{ pubkey: this.wallet, isSigner: true, isWritable: false }],
                    data: Buffer.from(voteData, 'utf-8'),
                    programId: new solanaWeb3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
                })
            );
            
            // Get recent blockhash
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet;
            
            // Sign and send transaction
            const signed = await window.solana.signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signed.serialize());
            
            // Wait for confirmation
            await this.connection.confirmTransaction(signature);
            
            return {
                success: true,
                signature: signature,
                message: `Vote recorded for ${coinChoice} with ${amount} ${currency}`
            };
            
        } catch (error) {
            console.error('Vote submission error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async getVotingHistory() {
        if (!this.wallet || !this.connection) return [];
        
        try {
            // Get transaction signatures for this wallet
            const signatures = await this.connection.getSignaturesForAddress(
                this.wallet,
                { limit: 50 }
            );
            
            const votingTransactions = [];
            
            for (const sigInfo of signatures) {
                try {
                    const tx = await this.connection.getTransaction(sigInfo.signature);
                    
                    // Check if transaction contains voting memo
                    if (tx && tx.transaction.message.instructions) {
                        for (const instruction of tx.transaction.message.instructions) {
                            if (instruction.programId.equals(new solanaWeb3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'))) {
                                try {
                                    const voteData = JSON.parse(instruction.data.toString('utf-8'));
                                    votingTransactions.push({
                                        signature: sigInfo.signature,
                                        ...voteData,
                                        blockTime: sigInfo.blockTime
                                    });
                                } catch (parseError) {
                                    // Not a vote transaction, skip
                                }
                            }
                        }
                    }
                } catch (txError) {
                    console.warn('Error parsing transaction:', txError);
                }
            }
            
            return votingTransactions;
            
        } catch (error) {
            console.error('Error getting voting history:', error);
            return [];
        }
    }
    
    disconnect() {
        if (window.solana) {
            window.solana.disconnect();
        }
        
        this.wallet = null;
        this.isConnected = false;
        this.balance = 0;
        this.mclBalance = 0;
    }
    
    formatAddress(address, chars = 4) {
        if (!address) return '';
        const addr = address.toString();
        return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
    }
    
    formatBalance(balance, decimals = 4) {
        return parseFloat(balance).toFixed(decimals);
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.MCLWallet = MCLWallet;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCLWallet;
}