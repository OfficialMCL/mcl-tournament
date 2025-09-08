// Main JavaScript for Meme Coin League
// Handles general site functionality and API integrations

class MCLTournament {
    constructor() {
        this.wallet = null;
        this.isConnected = false;
        this.currentBattle = null;
        this.publicWallet = 'MCL_PUBLIC_WALLET_ADDRESS_HERE'; // Replace with actual address
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startDataRefresh();
    }

    setupEventListeners() {
        // Wallet connection
        document.getElementById('connect-wallet')?.addEventListener('click', () => {
            this.connectWallet();
        });

        // Load bracket button
        document.getElementById('load-bracket')?.addEventListener('click', () => {
            this.loadBracket();
        });

        // Copy wallet address
        window.copyAddress = () => {
            navigator.clipboard.writeText(this.publicWallet);
            this.showNotification('Indirizzo copiato!');
        };

        // Smooth scrolling
        window.scrollTo = (target) => {
            document.querySelector(target)?.scrollIntoView({ 
                behavior: 'smooth' 
            });
        };
    }

    async connectWallet() {
        try {
            // Check if Phantom wallet is available
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                this.wallet = response.publicKey.toString();
                this.isConnected = true;
                
                this.updateWalletUI();
                this.showNotification('Wallet connesso con successo!');
                
                // Load user data
                await this.loadUserData();
            } else {
                this.showNotification('Phantom Wallet non trovato. Installalo da phantom.app', 'error');
            }
        } catch (error) {
            console.error('Errore connessione wallet:', error);
            this.showNotification('Errore nella connessione del wallet', 'error');
        }
    }

    updateWalletUI() {
        const walletBtn = document.getElementById('connect-wallet');
        if (walletBtn && this.isConnected) {
            walletBtn.innerHTML = `<i class="fas fa-wallet"></i> ${this.wallet.slice(0, 4)}...${this.wallet.slice(-4)}`;
            walletBtn.style.background = 'var(--success-color)';
        }
    }

    async loadInitialData() {
        try {
            // Load stats
            await this.loadStats();
            
            // Load public wallet address
            document.getElementById('public-wallet-addr').textContent = this.publicWallet;
            
            // Load recent transactions
            await this.loadRecentTransactions();
            
            // Load participating coins
            await this.loadParticipatingCoins();
            
        } catch (error) {
            console.error('Errore caricamento dati iniziali:', error);
        }
    }

    async loadStats() {
        try {
            // Placeholder data - replace with actual API calls
            const stats = {
                totalPool: '0',
                activeBattles: '0', 
                totalVotes: '0'
            };

            // Update UI
            document.getElementById('total-pool').textContent = `${stats.totalPool} SOL`;
            document.getElementById('active-battles').textContent = stats.activeBattles;
            document.getElementById('total-votes').textContent = stats.totalVotes;
            
        } catch (error) {
            console.error('Errore caricamento statistiche:', error);
        }
    }

    async loadBracket() {
        try {
            const bracketContainer = document.getElementById('bracket-container');
            bracketContainer.innerHTML = '<div class="loading">Caricamento bracket...</div>';
            
            // Placeholder bracket data
            const bracketData = {
                rounds: [
                    {
                        name: 'Quarti di Finale',
                        matches: [
                            { team1: 'DOGE', team2: 'SHIB', winner: null },
                            { team1: 'PEPE', team2: 'BONK', winner: null },
                            { team1: 'WIF', team2: 'FLOKI', winner: null },
                            { team1: 'MEME', team2: 'CAT', winner: null }
                        ]
                    }
                ]
            };
            
            this.renderBracket(bracketData);
            
        } catch (error) {
            console.error('Errore caricamento bracket:', error);
            document.getElementById('bracket-container').innerHTML = 
                '<div class="error">Errore nel caricamento del bracket</div>';
        }
    }

    renderBracket(data) {
        const bracketContainer = document.getElementById('bracket-container');
        let html = '<div class="bracket-rounds">';
        
        data.rounds.forEach(round => {
            html += `<div class="bracket-round">
                <h3>${round.name}</h3>
                <div class="matches">`;
            
            round.matches.forEach(match => {
                html += `<div class="match">
                    <div class="team ${match.winner === match.team1 ? 'winner' : ''}">${match.team1}</div>
                    <div class="vs">VS</div>
                    <div class="team ${match.winner === match.team2 ? 'winner' : ''}">${match.team2}</div>
                    <button class="vote-btn" onclick="mcl.openVoting('${match.team1}', '${match.team2}')">
                        Vota
                    </button>
                </div>`;
            });
            
            html += '</div></div>';
        });
        
        html += '</div>';
        bracketContainer.innerHTML = html;
    }

    async loadRecentTransactions() {
        try {
            const txList = document.getElementById('tx-list');
            
            // Placeholder transactions - replace with Solana API calls
            const transactions = [
                {
                    signature: 'abc123...def456',
                    amount: '0.1 SOL',
                    from: 'ABC123...DEF456',
                    type: 'Vote',
                    timestamp: new Date().toLocaleString()
                }
            ];
            
            let html = '';
            transactions.forEach(tx => {
                html += `<div class="transaction">
                    <div class="tx-info">
                        <span class="tx-type">${tx.type}</span>
                        <span class="tx-amount">${tx.amount}</span>
                    </div>
                    <div class="tx-details">
                        <span class="tx-from">${tx.from}</span>
                        <span class="tx-time">${tx.timestamp}</span>
                    </div>
                </div>`;
            });
            
            txList.innerHTML = html || '<p>Nessuna transazione recente</p>';
            
        } catch (error) {
            console.error('Errore caricamento transazioni:', error);
        }
    }

    async loadParticipatingCoins() {
        try {
            const coinsGrid = document.getElementById('coins-grid');
            
            // Placeholder coins - replace with actual memecoin data
            const coins = [
                { symbol: 'DOGE', name: 'Dogecoin', price: '$0.08', marketCap: '$11.2B', logo: '🐕' },
                { symbol: 'SHIB', name: 'Shiba Inu', price: '$0.000009', marketCap: '$5.1B', logo: '🐕' },
                { symbol: 'PEPE', name: 'Pepe', price: '$0.000001', marketCap: '$423M', logo: '🐸' },
                { symbol: 'BONK', name: 'Bonk', price: '$0.000015', marketCap: '$1.1B', logo: '🐕' }
            ];
            
            let html = '';
            coins.forEach(coin => {
                html += `<div class="coin-card">
                    <div class="coin-logo">${coin.logo}</div>
                    <div class="coin-info">
                        <h3>${coin.symbol}</h3>
                        <p class="coin-name">${coin.name}</p>
                        <div class="coin-stats">
                            <span class="price">${coin.price}</span>
                            <span class="market-cap">Cap: ${coin.marketCap}</span>
                        </div>
                    </div>
                </div>`;
            });
            
            coinsGrid.innerHTML = html;
            
        } catch (error) {
            console.error('Errore caricamento coins:', error);
        }
    }

    async loadUserData() {
        if (!this.isConnected) return;
        
        try {
            // Load user's MCL balance, voting history, etc.
            // Placeholder implementation
            console.log('Loading user data for:', this.wallet);
            
        } catch (error) {
            console.error('Errore caricamento dati utente:', error);
        }
    }

    openVoting(team1, team2) {
        if (!this.isConnected) {
            this.showNotification('Connetti il wallet per votare', 'error');
            return;
        }
        
        // Show voting interface
        const votingInterface = document.getElementById('voting-interface');
        votingInterface.innerHTML = `
            <div class="battle-vote">
                <h3>Vota per la tua scelta</h3>
                <div class="battle-teams">
                    <button class="team-vote-btn" onclick="mcl.vote('${team1}')">
                        <span>${team1}</span>
                        <span class="vote-count">0 voti</span>
                    </button>
                    <div class="vs-separator">VS</div>
                    <button class="team-vote-btn" onclick="mcl.vote('${team2}')">
                        <span>${team2}</span>
                        <span class="vote-count">0 voti</span>
                    </button>
                </div>
                <div class="vote-input">
                    <label>Importo stake:</label>
                    <input type="number" id="stake-amount" placeholder="0.1" min="0.1" max="10" step="0.1">
                    <select id="stake-currency">
                        <option value="SOL">SOL</option>
                        <option value="MCL">MCL</option>
                    </select>
                </div>
            </div>
        `;
        
        // Scroll to voting section
        document.getElementById('voting').scrollIntoView({ behavior: 'smooth' });
    }

    async vote(team) {
        try {
            const amount = document.getElementById('stake-amount').value;
            const currency = document.getElementById('stake-currency').value;
            
            if (!amount || amount <= 0) {
                this.showNotification('Inserisci un importo valido', 'error');
                return;
            }
            
            // Placeholder voting logic - replace with actual smart contract interaction
            console.log(`Voting for ${team} with ${amount} ${currency}`);
            
            this.showNotification(`Voto registrato per ${team}!`, 'success');
            
        } catch (error) {
            console.error('Errore nel voto:', error);
            this.showNotification('Errore nel registrare il voto', 'error');
        }
    }

    startDataRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.loadStats();
                this.loadRecentTransactions();
            }
        }, 30000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? 'var(--danger-color)' : 
                           type === 'success' ? 'var(--success-color)' : 
                           'var(--primary-color)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mcl = new MCLTournament();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCLTournament;
}