// MemeTournament Application JavaScript

class MemeTournamentApp {
    constructor() {
        this.isWalletConnected = false;
        this.currentWallet = null;
        this.connectedWalletAddress = '5KXtg2CW87HFtjNVKk6VWKAcPbKA6V5sJQvFdpFv7K2';
        this.currentPage = 'home';
        this.carouselIndex = 0;
        this.mockBalances = {
            solana: '12.45',
            mcl: '1250.00'
        };
        
        // Tournament data
        this.tournamentData = {
            phase: 'Round of 16',
            startTime: new Date('2025-09-11T22:00:00Z'), // Wednesday 22:00 UTC
            currentTime: new Date('2025-09-12T00:00:00Z'), // Thursday 00:00 UTC  
            endTime: new Date('2025-09-12T22:00:00Z'), // Thursday 22:00 UTC
            votes: {
                'DOGE': 1247,
                'PEPE': 987
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCarousel();
        this.updateWalletUI();
        this.updateTournamentTimer();
        this.setupPDFViewer();
        
        // Update timer every minute
        setInterval(() => {
            this.updateTournamentTimer();
        }, 60000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page') || 'home';
                this.navigateToPage(page);
            });
        });

        // Wallet connection
        const connectWalletBtn = document.getElementById('connect-wallet');
        const walletDropdown = document.getElementById('wallet-dropdown');

        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isWalletConnected) {
                    this.showDashboard();
                } else {
                    walletDropdown?.classList.toggle('hidden');
                }
            });
        }

        // Wallet options
        document.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', () => {
                const walletType = option.getAttribute('data-wallet');
                this.connectWallet(walletType);
                walletDropdown?.classList.add('hidden');
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.wallet-section')) {
                walletDropdown?.classList.add('hidden');
            }
        });

        // Hero buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.textContent.includes('Join Tournament')) {
                    this.navigateToPage('tournament');
                } else if (btn.textContent.includes('Buy $MCL')) {
                    this.navigateToPage('tokenomics');
                }
            });
        });

        // Tournament voting buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('vote-btn')) {
                this.handleVote(e.target);
            }
        });

        // Buy MCL button
        const buyMCLBtn = document.getElementById('buy-mcl-btn');
        if (buyMCLBtn) {
            buyMCLBtn.addEventListener('click', () => {
                this.handleBuyMCL();
            });
        }

        // PDF Download
        const downloadPDFBtn = document.getElementById('download-pdf');
        if (downloadPDFBtn) {
            downloadPDFBtn.addEventListener('click', () => {
                this.downloadWhitepaper();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // FAQ items (expandable)
        document.querySelectorAll('.faq-item h3').forEach(question => {
            question.style.cursor = 'pointer';
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isVisible = answer.style.display === 'block';
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item p').forEach(p => {
                    if (p !== answer) {
                        p.style.display = 'none';
                    }
                });
                
                answer.style.display = isVisible ? 'none' : 'block';
                question.style.color = isVisible ? 
                    'var(--tournament-orange-primary)' : 
                    'var(--tournament-orange-secondary)';
            });
        });

        // Initialize FAQ answers as hidden
        document.querySelectorAll('.faq-item p').forEach(answer => {
            answer.style.display = 'none';
        });
    }

    setupCarousel() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const indicators = document.querySelectorAll('.indicator');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousSlide();
            });

            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            if (this.currentPage === 'whitepaper') {
                this.nextSlide();
            }
        }, 5000);
    }

    setupPDFViewer() {
        // Create a simple PDF content for demonstration
        const pdfViewer = document.getElementById('pdf-viewer');
        if (pdfViewer) {
            const iframe = pdfViewer.querySelector('iframe');
            if (iframe) {
                // Create a data URL with PDF-like content
                const pdfContent = this.generatePDFContent();
                iframe.src = `data:text/html,${encodeURIComponent(pdfContent)}`;
            }
        }
    }

    generatePDFContent() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        background: #f9f9f9; 
                        color: #333;
                        line-height: 1.6;
                    }
                    h1 { color: #ff6b35; text-align: center; }
                    h2 { color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 5px; }
                    .section { margin-bottom: 30px; padding: 20px; background: white; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>MemeTournament Whitepaper</h1>
                <div class="section">
                    <h2>1. Executive Summary</h2>
                    <p>MemeTournament revolutionizes the memecoin space by introducing competitive tournaments where community members stake $MCL tokens to vote for their favorite memecoins. Our platform combines the viral nature of memecoins with fair, transparent competition mechanics built on Solana blockchain.</p>
                </div>
                
                <div class="section">
                    <h2>2. Technology Stack</h2>
                    <p>Built on Solana blockchain for lightning-fast transactions and minimal fees. Our smart contracts ensure transparent voting and secure token management, while our user-friendly interface makes participation accessible to all crypto enthusiasts.</p>
                </div>
                
                <div class="section">
                    <h2>3. Tokenomics</h2>
                    <p>$MCL serves as the primary utility token for voting, staking rewards, and platform governance. With a total supply of 1 billion tokens, the distribution ensures fair participation while rewarding early adopters and active community members.</p>
                    <ul>
                        <li>Total Supply: 1,000,000,000 MCL</li>
                        <li>Circulating Supply: 650,000,000 MCL</li>
                        <li>Tournament Rewards: 25%</li>
                        <li>Community Treasury: 20%</li>
                        <li>Team & Advisors: 15%</li>
                        <li>Public Sale: 40%</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h2>4. Tournament Mechanics</h2>
                    <p>Weekly tournaments feature head-to-head memecoin battles following a bracket system:</p>
                    <ul>
                        <li><strong>Wednesday 22:00 UTC:</strong> Tournament begins (Round of 16)</li>
                        <li><strong>Thursday 22:00 UTC:</strong> Quarter-finals</li>
                        <li><strong>Friday 22:00 UTC:</strong> Semi-finals</li>
                        <li><strong>Saturday 22:00 UTC:</strong> Finals</li>
                        <li><strong>Sunday 22:00 UTC:</strong> Results & Rewards Distribution</li>
                    </ul>
                    <p>Users stake $MCL tokens to vote for winners, with prize pools distributed among successful voters. The transparent voting system ensures fair outcomes and community engagement.</p>
                </div>
                
                <div class="section">
                    <h2>5. Governance</h2>
                    <p>$MCL token holders participate in platform governance, voting on new features, tournament formats, and protocol upgrades. This ensures the platform evolves according to community needs and preferences.</p>
                </div>
            </body>
            </html>
        `;
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${pageName}"]`) || 
                          document.querySelector('.nav-link[href="index.html"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageName;

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    connectWallet(walletType) {
        // Simulate wallet connection
        this.isWalletConnected = true;
        this.currentWallet = walletType;
        
        // Generate a random-looking wallet address
        this.connectedWalletAddress = this.generateWalletAddress();
        
        // Show connection success
        this.showNotification(`${walletType} wallet connected successfully!`, 'success');
        
        // Update UI
        this.updateWalletUI();
    }

    generateWalletAddress() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        let result = '';
        for (let i = 0; i < 44; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    formatWalletAddress(address) {
        if (!address || address.length < 8) return address;
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    }

    disconnectWallet() {
        this.isWalletConnected = false;
        this.currentWallet = null;
        this.connectedWalletAddress = '';
        this.updateWalletUI();
        this.showNotification('Wallet disconnected', 'info');
        
        // Return to home page if on dashboard
        if (this.currentPage === 'dashboard') {
            this.navigateToPage('home');
        }
    }

    updateWalletUI() {
        const connectBtn = document.getElementById('connect-wallet');
        
        if (connectBtn) {
            if (this.isWalletConnected) {
                const shortAddress = this.formatWalletAddress(this.connectedWalletAddress);
                connectBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${shortAddress}`;
                connectBtn.classList.add('connected');
                connectBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                connectBtn.style.color = '#ffffff';
            } else {
                connectBtn.innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet`;
                connectBtn.classList.remove('connected');
                connectBtn.style.background = 'linear-gradient(135deg, var(--tournament-orange-primary), var(--tournament-orange-secondary))';
                connectBtn.style.color = 'var(--tournament-black)';
            }
        }
    }

    showDashboard() {
        if (!this.isWalletConnected) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }

        // Create dashboard modal
        this.createDashboardModal();
    }

    createDashboardModal() {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('dashboard-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'dashboard-modal';
        modal.className = 'dashboard-modal';
        
        modal.innerHTML = `
            <div class="dashboard-content">
                <aside class="dashboard-sidebar">
                    <div class="sidebar-header">
                        <h3>Dashboard</h3>
                        <button class="close-dashboard" id="close-dashboard">×</button>
                    </div>
                    <nav class="sidebar-nav">
                        <div class="nav-item active" data-section="overview">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </div>
                        <div class="nav-item" data-section="profile">
                            <i class="fas fa-user"></i>
                            <span>Profile</span>
                        </div>
                        <div class="nav-item" data-section="history">
                            <i class="fas fa-history"></i>
                            <span>History</span>
                        </div>
                        <div class="nav-item" data-section="settings">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </div>
                        <div class="nav-item disconnect" id="disconnect-wallet">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Disconnect</span>
                        </div>
                    </nav>
                </aside>
                <main class="dashboard-main" id="dashboard-main">
                    ${this.getDashboardContent('overview')}
                </main>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        this.setupDashboardEventListeners();

        // Show modal with animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    getDashboardContent(section) {
        switch (section) {
            case 'overview':
                return `
                    <div class="dashboard-section active">
                        <h1 class="section-title">Dashboard Overview</h1>
                        
                        <div class="balance-cards">
                            <div class="balance-card">
                                <div class="balance-icon">
                                    <i class="fas fa-sun"></i>
                                </div>
                                <div class="balance-info">
                                    <h3>SOL Balance</h3>
                                    <div class="balance-amount">${this.mockBalances.solana} SOL</div>
                                </div>
                            </div>
                            <div class="balance-card">
                                <div class="balance-icon">
                                    <i class="fas fa-coins"></i>
                                </div>
                                <div class="balance-info">
                                    <h3>MCL Balance</h3>
                                    <div class="balance-amount">${this.mockBalances.mcl} MCL</div>
                                </div>
                            </div>
                        </div>

                        <div class="wallet-info-card">
                            <h3>Wallet Information</h3>
                            <div class="wallet-details">
                                <div class="wallet-detail">
                                    <label>Wallet Address</label>
                                    <div class="wallet-address-full">${this.connectedWalletAddress}</div>
                                    <button class="btn btn-sm copy-btn" onclick="app.copyToClipboard('${this.connectedWalletAddress}')">
                                        <i class="fas fa-copy"></i> Copy
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="quick-actions">
                            <h3>Quick Actions</h3>
                            <div class="action-buttons">
                                <button class="btn btn-primary" onclick="app.navigateToPage('tokenomics'); app.closeDashboard();">
                                    <i class="fas fa-shopping-cart"></i> Buy More MCL
                                </button>
                                <button class="btn btn-secondary" onclick="app.showDashboardSection('history')">
                                    <i class="fas fa-history"></i> View History
                                </button>
                                <button class="btn btn-outline" onclick="app.navigateToPage('tournament'); app.closeDashboard();">
                                    <i class="fas fa-trophy"></i> Join Tournament
                                </button>
                            </div>
                        </div>
                    </div>
                `;

            case 'profile':
                return `
                    <div class="dashboard-section">
                        <h1 class="section-title">Profile Settings</h1>
                        
                        <div class="profile-form">
                            <div class="avatar-section">
                                <div class="avatar-container">
                                    <div class="avatar-preview">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <button class="btn btn-secondary" onclick="app.showNotification('Avatar upload feature coming soon!', 'info')">
                                        <i class="fas fa-camera"></i> Upload Avatar
                                    </button>
                                </div>
                            </div>

                            <form class="profile-form-fields">
                                <div class="form-group">
                                    <label class="form-label">Username</label>
                                    <input type="text" class="form-control" placeholder="Enter your username">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Bio</label>
                                    <textarea class="form-control" rows="4" placeholder="Tell us about yourself..."></textarea>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Email (Optional)</label>
                                    <input type="email" class="form-control" placeholder="Enter your email">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Discord Username (Optional)</label>
                                    <input type="text" class="form-control" placeholder="Enter your Discord username">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Twitter Handle (Optional)</label>
                                    <input type="text" class="form-control" placeholder="@yourhandle">
                                </div>

                                <button type="button" class="btn btn-primary" onclick="app.saveProfile()">
                                    <i class="fas fa-save"></i> Save Profile
                                </button>
                            </form>
                        </div>
                    </div>
                `;

            case 'history':
                return `
                    <div class="dashboard-section">
                        <h1 class="section-title">Transaction History</h1>
                        
                        <div class="history-filters">
                            <select class="form-control">
                                <option value="all">All Transactions</option>
                                <option value="purchase">Purchases</option>
                                <option value="stake">Staking</option>
                                <option value="sale">Sales</option>
                            </select>
                        </div>

                        <div class="transactions-list">
                            <div class="transaction-item">
                                <div class="transaction-icon purchase">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                                <div class="transaction-details">
                                    <h4>Purchase</h4>
                                    <p>Bought 500 $MCL for 2.3 SOL</p>
                                    <span class="transaction-date">September 10, 2025 15:30 UTC</span>
                                </div>
                                <div class="transaction-amount positive">+500 MCL</div>
                            </div>

                            <div class="transaction-item">
                                <div class="transaction-icon stake">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="transaction-details">
                                    <h4>Stake</h4>
                                    <p>Staked 100 $MCL in Round of 16</p>
                                    <span class="transaction-date">September 11, 2025 00:15 UTC</span>
                                </div>
                                <div class="transaction-amount negative">-100 MCL</div>
                            </div>

                            <div class="transaction-item">
                                <div class="transaction-icon purchase">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                                <div class="transaction-details">
                                    <h4>Purchase</h4>
                                    <p>Bought 250 $MCL for 1.1 SOL</p>
                                    <span class="transaction-date">September 9, 2025 20:45 UTC</span>
                                </div>
                                <div class="transaction-amount positive">+250 MCL</div>
                            </div>
                        </div>
                    </div>
                `;

            case 'settings':
                return `
                    <div class="dashboard-section">
                        <h1 class="section-title">Settings</h1>
                        
                        <div class="settings-groups">
                            <div class="settings-group">
                                <h3>Preferences</h3>
                                <div class="setting-item">
                                    <label>Email Notifications</label>
                                    <input type="checkbox" checked>
                                </div>
                                <div class="setting-item">
                                    <label>Tournament Reminders</label>
                                    <input type="checkbox" checked>
                                </div>
                            </div>

                            <div class="settings-group">
                                <h3>Account</h3>
                                <button class="btn btn-outline" onclick="app.showNotification('Data export initiated', 'info')">
                                    <i class="fas fa-download"></i> Export My Data
                                </button>
                            </div>
                        </div>
                    </div>
                `;

            default:
                return this.getDashboardContent('overview');
        }
    }

    setupDashboardEventListeners() {
        const modal = document.getElementById('dashboard-modal');
        
        // Close button
        const closeBtn = document.getElementById('close-dashboard');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeDashboard();
            });
        }

        // Disconnect button
        const disconnectBtn = document.getElementById('disconnect-wallet');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to disconnect your wallet?')) {
                    this.disconnectWallet();
                    this.closeDashboard();
                }
            });
        }

        // Navigation items
        modal.querySelectorAll('.nav-item:not(.disconnect)').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.showDashboardSection(section);
                
                // Update active state
                modal.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDashboard();
            }
        });
    }

    showDashboardSection(section) {
        const dashboardMain = document.getElementById('dashboard-main');
        if (dashboardMain) {
            dashboardMain.innerHTML = this.getDashboardContent(section);
        }
    }

    closeDashboard() {
        const modal = document.getElementById('dashboard-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Address copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Address copied to clipboard!', 'success');
        });
    }

    saveProfile() {
        this.showNotification('Profile saved successfully!', 'success');
    }

    updateTournamentTimer() {
        const now = new Date();
        const tournamentStart = new Date('2025-09-11T22:00:00Z'); // Wednesday 22:00 UTC
        const tournamentEnd = new Date('2025-09-12T22:00:00Z'); // Thursday 22:00 UTC
        const nextTournamentStart = new Date('2025-09-18T22:00:00Z'); // Next Wednesday 22:00 UTC

        let timeRemaining;
        let phase = 'Round of 16';
        let displayText;

        // Since current time is Thursday 00:00 UTC, we're in Round of 16
        if (now >= tournamentStart && now < tournamentEnd) {
            // Currently in Round of 16
            timeRemaining = tournamentEnd.getTime() - now.getTime();
            phase = 'Round of 16';
        } else if (now >= tournamentEnd) {
            // Tournament ended, show time to next tournament
            timeRemaining = nextTournamentStart.getTime() - now.getTime();
            phase = 'Tournament ended';
        } else {
            // Before tournament starts
            timeRemaining = tournamentStart.getTime() - now.getTime();
            phase = 'Tournament starting soon';
        }

        // Convert to hours and minutes
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        if (days > 0) {
            displayText = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} remaining`;
        } else {
            displayText = `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        }

        // Update all timer displays
        const timerElements = [
            document.getElementById('tournament-timer'),
            document.getElementById('sidebar-timer'),
            document.getElementById('mobile-timer')
        ];

        timerElements.forEach(element => {
            if (element) {
                element.textContent = displayText;
            }
        });

        // Update phase display
        const phaseElement = document.getElementById('tournament-phase');
        if (phaseElement) {
            phaseElement.textContent = phase;
        }
    }

    handleVote(button) {
        if (!this.isWalletConnected) {
            this.showNotification('Please connect your wallet to vote', 'warning');
            return;
        }

        const stakeInput = document.getElementById('stake-amount');
        const stakeAmount = stakeInput ? parseFloat(stakeInput.value) : 0;

        if (!stakeAmount || stakeAmount <= 0) {
            this.showNotification('Please enter a valid stake amount', 'error');
            return;
        }

        const currentMCL = parseFloat(this.mockBalances.mcl);
        if (stakeAmount > currentMCL) {
            this.showNotification('Insufficient MCL balance', 'error');
            return;
        }

        const coinName = button.getAttribute('data-coin');
        
        // Simulate voting
        this.showNotification(`Successfully voted ${stakeAmount} MCL for ${coinName}!`, 'success');
        
        // Update mock balance
        this.mockBalances.mcl = (currentMCL - stakeAmount).toFixed(2);
        
        // Update vote counts with real-time effect
        this.updateVoteCounts(coinName, stakeAmount);
        
        // Clear input
        if (stakeInput) stakeInput.value = '';
    }

    updateVoteCounts(votedCoin, amount) {
        // Update vote count
        this.tournamentData.votes[votedCoin] += Math.floor(amount / 10); // 1 vote per 10 MCL staked
        
        // Update display with animation
        const voteElement = document.getElementById(`${votedCoin.toLowerCase()}-votes`);
        if (voteElement) {
            const newCount = this.tournamentData.votes[votedCoin];
            voteElement.style.transform = 'scale(1.2)';
            voteElement.style.color = 'var(--tournament-orange-primary)';
            
            setTimeout(() => {
                voteElement.textContent = `${newCount.toLocaleString()} votes`;
                voteElement.style.transform = 'scale(1)';
                voteElement.style.color = 'var(--tournament-text-muted)';
            }, 200);
        }

        // Update mobile display as well
        const mobileVoteCount = document.querySelector('.mock-tournament .vote-count');
        if (mobileVoteCount) {
            const totalVotes = Object.values(this.tournamentData.votes).reduce((a, b) => a + b, 0);
            mobileVoteCount.textContent = `${totalVotes.toLocaleString()} votes`;
        }
    }

    handleBuyMCL() {
        if (!this.isWalletConnected) {
            this.showNotification('Please connect your wallet to buy MCL', 'warning');
            return;
        }

        const buyInput = document.getElementById('sol-amount');
        const solAmount = buyInput ? parseFloat(buyInput.value) : 0;

        if (!solAmount || solAmount <= 0) {
            this.showNotification('Please enter a valid SOL amount', 'error');
            return;
        }

        const currentSOL = parseFloat(this.mockBalances.solana);
        if (solAmount > currentSOL) {
            this.showNotification('Insufficient SOL balance', 'error');
            return;
        }

        // Simulate purchase (1 SOL = 2000 MCL)
        const mclAmount = solAmount * 2000;
        
        this.showNotification(`Successfully bought ${mclAmount.toLocaleString()} MCL for ${solAmount} SOL!`, 'success');
        
        // Update mock balances
        const currentMCL = parseFloat(this.mockBalances.mcl);
        
        this.mockBalances.solana = (currentSOL - solAmount).toFixed(2);
        this.mockBalances.mcl = (currentMCL + mclAmount).toFixed(2);
        
        // Clear input
        if (buyInput) buyInput.value = '';
    }

    downloadWhitepaper() {
        // Create a downloadable PDF
        this.showNotification('Generating whitepaper PDF...', 'info');
        
        // Simulate PDF generation and download
        setTimeout(() => {
            const element = document.createElement('a');
            const content = this.generatePDFText();
            const file = new Blob([content], { type: 'text/plain' });
            
            element.href = URL.createObjectURL(file);
            element.download = 'MemeTournament-Whitepaper.pdf';
            element.style.display = 'none';
            
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            
            this.showNotification('Whitepaper downloaded successfully!', 'success');
        }, 1000);
    }

    generatePDFText() {
        return `
MEMETOURNAMENT WHITEPAPER
========================

1. EXECUTIVE SUMMARY
===================
MemeTournament revolutionizes the memecoin space by introducing competitive tournaments where community members stake $MCL tokens to vote for their favorite memecoins. Our platform combines the viral nature of memecoins with fair, transparent competition mechanics built on Solana blockchain.

2. TECHNOLOGY STACK
==================
Built on Solana blockchain for lightning-fast transactions and minimal fees. Our smart contracts ensure transparent voting and secure token management, while our user-friendly interface makes participation accessible to all crypto enthusiasts.

3. TOKENOMICS
============
$MCL serves as the primary utility token for voting, staking rewards, and platform governance. With a total supply of 1 billion tokens, the distribution ensures fair participation while rewarding early adopters and active community members.

Total Supply: 1,000,000,000 MCL
Circulating Supply: 650,000,000 MCL
Tournament Rewards: 25%
Community Treasury: 20%
Team & Advisors: 15%
Public Sale: 40%

4. TOURNAMENT MECHANICS
======================
Weekly tournaments feature head-to-head memecoin battles following a bracket system:

- Wednesday 22:00 UTC: Tournament begins (Round of 16)
- Thursday 22:00 UTC: Quarter-finals  
- Friday 22:00 UTC: Semi-finals
- Saturday 22:00 UTC: Finals
- Sunday 22:00 UTC: Results & Rewards Distribution

Users stake $MCL tokens to vote for winners, with prize pools distributed among successful voters. The transparent voting system ensures fair outcomes and community engagement.

5. GOVERNANCE
============
$MCL token holders participate in platform governance, voting on new features, tournament formats, and protocol upgrades. This ensures the platform evolves according to community needs and preferences.

Contact: team@memetournament.io
Website: https://memetournament.io
        `;
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input, textarea');
        let hasEmpty = false;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                hasEmpty = true;
            }
        });

        if (hasEmpty) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate form submission
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;

        slides[this.carouselIndex].classList.remove('active');
        indicators[this.carouselIndex].classList.remove('active');
        
        this.carouselIndex = (this.carouselIndex + 1) % slides.length;
        
        slides[this.carouselIndex].classList.add('active');
        indicators[this.carouselIndex].classList.add('active');
    }

    previousSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;

        slides[this.carouselIndex].classList.remove('active');
        indicators[this.carouselIndex].classList.remove('active');
        
        this.carouselIndex = this.carouselIndex === 0 ? slides.length - 1 : this.carouselIndex - 1;
        
        slides[this.carouselIndex].classList.add('active');
        indicators[this.carouselIndex].classList.add('active');
    }

    goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (index < 0 || index >= slides.length) return;

        slides[this.carouselIndex].classList.remove('active');
        indicators[this.carouselIndex].classList.remove('active');
        
        this.carouselIndex = index;
        
        slides[this.carouselIndex].classList.add('active');
        indicators[this.carouselIndex].classList.add('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            backgroundColor: this.getNotificationColor(type),
            color: type === 'warning' ? '#000' : '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '3000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'inherit';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.marginLeft = '12px';

        const closeNotification = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeNotification);

        // Auto-close after 5 seconds
        setTimeout(closeNotification, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }
}

// Global app instance
let app;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new MemeTournamentApp();
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Mobile optimizations
            document.querySelectorAll('.carousel-btn').forEach(btn => {
                btn.style.position = 'relative';
                btn.style.margin = '10px';
            });
        }
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .stat-card, .team-member').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    console.log('MemeTournament App initialized successfully!');
});