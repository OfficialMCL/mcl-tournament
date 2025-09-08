// API integrations for Meme Coin League
// Handles CoinMarketCap, Solana, and other external API calls

class MCLApi {
    constructor() {
        this.coinGeckoBase = 'https://api.coingecko.com/api/v3';
        this.solanaRpcUrl = 'https://api.mainnet-beta.solana.com';
        this.cmcApiKey = 'YOUR_CMC_API_KEY'; // Replace with actual API key
        this.rateLimit = new Map(); // Simple rate limiting
    }
    
    // Rate limiting helper
    checkRateLimit(endpoint, limit = 10, window = 60000) {
        const now = Date.now();
        const key = endpoint;
        
        if (!this.rateLimit.has(key)) {
            this.rateLimit.set(key, []);
        }
        
        const calls = this.rateLimit.get(key);
        const validCalls = calls.filter(time => now - time < window);
        
        if (validCalls.length >= limit) {
            return false;
        }
        
        validCalls.push(now);
        this.rateLimit.set(key, validCalls);
        return true;
    }
    
    // Get memecoin data from CoinGecko (free tier)
    async getMemecoinData(coinIds) {
        if (!this.checkRateLimit('coingecko', 10)) {
            throw new Error('Rate limit exceeded');
        }
        
        try {
            const ids = Array.isArray(coinIds) ? coinIds.join(',') : coinIds;
            const url = `${this.coinGeckoBase}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`CoinGecko API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            return data.map(coin => ({
                id: coin.id,
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                marketCap: coin.market_cap,
                volume24h: coin.total_volume,
                priceChange24h: coin.price_change_percentage_24h,
                logo: coin.image,
                rank: coin.market_cap_rank
            }));
            
        } catch (error) {
            console.error('Error fetching memecoin data:', error);
            throw error;
        }
    }
    
    // Get Solana token information
    async getSolanaTokenInfo(mintAddress) {
        try {
            const connection = new solanaWeb3.Connection(this.solanaRpcUrl);
            
            // Get token supply
            const supply = await connection.getTokenSupply(new solanaWeb3.PublicKey(mintAddress));
            
            // Get token metadata (this requires additional setup)
            // For now, we'll return basic info
            return {
                mintAddress,
                supply: supply.value.uiAmount,
                decimals: supply.value.decimals
            };
            
        } catch (error) {
            console.error('Error fetching Solana token info:', error);
            throw error;
        }
    }
    
    // Get tournament participants (hardcoded for MVP)
    async getTournamentParticipants() {
        // This would normally come from your backend/database
        const participants = [
            {
                id: 'dogecoin',
                symbol: 'DOGE',
                name: 'Dogecoin',
                mintAddress: null, // Not on Solana
                category: 'large'
            },
            {
                id: 'shiba-inu',
                symbol: 'SHIB',
                name: 'Shiba Inu',
                mintAddress: null, // Not on Solana
                category: 'large'
            },
            {
                id: 'pepe',
                symbol: 'PEPE',
                name: 'Pepe',
                mintAddress: null, // ERC-20
                category: 'medium'
            },
            {
                id: 'bonk',
                symbol: 'BONK',
                name: 'Bonk',
                mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Solana
                category: 'medium'
            },
            {
                id: 'dogwifhat',
                symbol: 'WIF',
                name: 'dogwifhat',
                mintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // Solana
                category: 'medium'
            },
            {
                id: 'floki',
                symbol: 'FLOKI',
                name: 'FLOKI',
                mintAddress: null, // Multi-chain
                category: 'small'
            }
        ];
        
        try {
            // Get price data for all participants
            const coinIds = participants.map(p => p.id);
            const priceData = await this.getMemecoinData(coinIds);
            
            // Combine participant info with price data
            return participants.map(participant => {
                const price = priceData.find(p => p.id === participant.id);
                return {
                    ...participant,
                    ...price
                };
            });
            
        } catch (error) {
            console.error('Error getting tournament participants:', error);
            // Return basic data without prices
            return participants;
        }
    }
    
    // Get current bracket status from backend
    async getCurrentBracket() {
        // Placeholder - this would call your backend API
        return {
            tournament_id: 'week_1_2025',
            status: 'active',
            current_round: 'quarterfinals',
            rounds: [
                {
                    round_name: 'Quarti di Finale',
                    matches: [
                        {
                            match_id: 1,
                            team1: { symbol: 'DOGE', votes: 156, percentage: 45.2 },
                            team2: { symbol: 'SHIB', votes: 189, percentage: 54.8 },
                            status: 'active',
                            time_remaining: '14:32:15',
                            total_staked: '23.5 SOL'
                        },
                        {
                            match_id: 2,
                            team1: { symbol: 'PEPE', votes: 234, percentage: 62.1 },
                            team2: { symbol: 'BONK', votes: 143, percentage: 37.9 },
                            status: 'active',
                            time_remaining: '14:32:15',
                            total_staked: '18.9 SOL'
                        }
                    ]
                }
            ]
        };
    }
    
    // Get pool statistics
    async getPoolStats() {
        try {
            // This would call Solana RPC to get actual wallet balance
            // For now, return placeholder data
            return {
                total_collected: '42.3 SOL',
                for_burn: '21.15 SOL',
                for_development: '21.15 SOL',
                transactions_count: 147,
                unique_voters: 89
            };
        } catch (error) {
            console.error('Error getting pool stats:', error);
            return {
                total_collected: '0 SOL',
                for_burn: '0 SOL',
                for_development: '0 SOL',
                transactions_count: 0,
                unique_voters: 0
            };
        }
    }
    
    // Get recent transactions from Solana
    async getRecentTransactions(walletAddress, limit = 10) {
        try {
            const connection = new solanaWeb3.Connection(this.solanaRpcUrl);
            const publicKey = new solanaWeb3.PublicKey(walletAddress);
            
            const signatures = await connection.getSignaturesForAddress(
                publicKey,
                { limit }
            );
            
            const transactions = [];
            
            for (const sig of signatures) {
                try {
                    const tx = await connection.getTransaction(sig.signature);
                    
                    if (tx && tx.meta) {
                        const amount = Math.abs(tx.meta.preBalances[0] - tx.meta.postBalances[0]) / solanaWeb3.LAMPORTS_PER_SOL;
                        
                        transactions.push({
                            signature: sig.signature,
                            amount: amount.toFixed(4),
                            timestamp: sig.blockTime,
                            type: amount > 0 ? 'Vote' : 'Payout',
                            from: this.formatAddress(tx.transaction.message.accountKeys[0].toString())
                        });
                    }
                } catch (txError) {
                    console.warn('Error parsing transaction:', txError);
                }
            }
            
            return transactions;
            
        } catch (error) {
            console.error('Error getting recent transactions:', error);
            return [];
        }
    }
    
    // Submit vote to backend
    async submitVote(voteData) {
        try {
            // This would call your backend API to record the vote
            // For MVP, we'll just simulate success
            console.log('Submitting vote:', voteData);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                vote_id: `vote_${Date.now()}`,
                message: 'Vote recorded successfully'
            };
            
        } catch (error) {
            console.error('Error submitting vote:', error);
            throw error;
        }
    }
    
    // Utility function to format wallet addresses
    formatAddress(address, chars = 7) {
        if (!address) return '';
        return `${address.slice(0, chars)}...${address.slice(-chars)}`;
    }
    
    // Format currency amounts
    formatCurrency(amount, currency = 'SOL', decimals = 4) {
        const num = parseFloat(amount);
        return `${num.toFixed(decimals)} ${currency}`;
    }
    
    // Format large numbers (market cap, etc.)
    formatLargeNumber(num) {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
        return `$${num.toFixed(2)}`;
    }
    
    // Cache management for API responses
    setCache(key, data, ttl = 300000) { // 5 minutes default
        const expiry = Date.now() + ttl;
        localStorage.setItem(`mcl_cache_${key}`, JSON.stringify({
            data,
            expiry
        }));
    }
    
    getCache(key) {
        try {
            const cached = localStorage.getItem(`mcl_cache_${key}`);
            if (!cached) return null;
            
            const { data, expiry } = JSON.parse(cached);
            if (Date.now() > expiry) {
                localStorage.removeItem(`mcl_cache_${key}`);
                return null;
            }
            
            return data;
        } catch (error) {
            return null;
        }
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.MCLApi = MCLApi;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCLApi;
}