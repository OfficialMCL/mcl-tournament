// MemeTournament Application JavaScript with Solana Integration - Fixed Version

class MemeTournamentApp {
    constructor() {
        this.isWalletConnected = false;
        this.currentWallet = null;
        this.walletAddress = null;
        this.currentPage = 'home';
        this.carouselIndex = 0;
        this.connection = null;
        this.tournamentTimer = null;
        
        // Solana Configuration
        this.solanaConfig = {
            mclTokenMint: '7xKXtg2CW87HFtjNVKk6VWKAcPbKA6V5sJQvFdpFv7K2',
            stakingContract: '9xKXtg2CW87HFtjNVKk6VWKAcPbKA6V5sJQvFdpFv7K3',
            tournamentContract: '8xKXtg2CW87HFtjNVKk6VWKAcPbKA6V5sJQvFdpFv7K4',
            rpcEndpoint: 'https://api.mainnet-beta.solana.com'
        };

        // Tournament Schedule (all times in UTC)
        this.tournamentSchedule = {
            roundOf16: { start: 22, end: 22, startDay: 3, endDay: 4 }, // Wed 22:00 - Thu 22:00
            quarterFinals: { start: 22, end: 22, startDay: 4, endDay: 5 }, // Thu 22:00 - Fri 22:00
            semiFinals: { start: 22, end: 22, startDay: 5, endDay: 6 }, // Fri 22:00 - Sat 22:00
            finals: { start: 22, end: 22, startDay: 6, endDay: 0 }, // Sat 22:00 - Sun 22:00
        };

        this.mockBalances = {
            solana: '12.45',
            mcl: '1,250.00'
        };
        
        this.init();
    }

    init() {
        this.setupLandingScreen();
        this.setupEventListeners();
        this.setupCarousel();
        this.initializeSolanaConnection();
        this.startTournamentTimer();
        this.updateWalletUI();
    }

    setupLandingScreen() {
        const landingScreen = document.getElementById('landing-screen');
        const mainApp = document.getElementById('main-app');
        let hasScrolled = false;

        const handleScroll = () => {
            if (!hasScrolled && (window.scrollY > 100 || event.deltaY > 0)) {
                hasScrolled = true;
                this.transitionToMainApp();
            }
        };

        const handleKeyDown = (e) => {
            if (!hasScrolled && (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown')) {
                e.preventDefault();
                hasScrolled = true;
                this.transitionToMainApp();
            }
        };

        // Event listeners for scroll transition
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleScroll);
        window.addEventListener('keydown', handleKeyDown);
        landingScreen.addEventListener('click', () => {
            if (!hasScrolled) {
                hasScrolled = true;
                this.transitionToMainApp();
            }
        });
    }

    transitionToMainApp() {
        const landingScreen = document.getElementById('landing-screen');
        const mainApp = document.getElementById('main-app');

        landingScreen.classList.add('scrolled');
        
        setTimeout(() => {
            mainApp.classList.remove('hidden');
            landingScreen.style.display = 'none';
            
            // Smooth scroll to top of main app
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);

        this.showNotification('Benvenuto in MemeTournament! 🚀', 'success');
    }

    initializeSolanaConnection() {
        try {
            if (typeof window.solanaWeb3 !== 'undefined') {
                this.connection = new window.solanaWeb3.Connection(this.solanaConfig.rpcEndpoint);
                console.log('Solana connection initialized');
            }
        } catch (error) {
            console.warn('Solana Web3.js not available:', error);
        }
    }

    setupEventListeners() {
        // Navigation - Fixed to handle both nav and footer links properly
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link, .footer-links a[data-page]');
            if (navLink) {
                e.preventDefault();
                e.stopPropagation();
                const page = navLink.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
                return false;
            }
        });

        // Wallet connection - Fixed event handling
        const connectWalletBtn = document.getElementById('connect-wallet');
        const walletDropdown = document.getElementById('wallet-dropdown');

        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.isWalletConnected) {
                    this.showDashboard();
                } else {
                    // Toggle wallet dropdown
                    walletDropdown.classList.toggle('hidden');
                }
                return false;
            });
        }

        // Wallet options - Fixed to properly handle wallet selection
        document.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const walletType = option.getAttribute('data-wallet');
                this.connectWallet(walletType);
                walletDropdown.classList.add('hidden');
                return false;
            });
        });

        // Dashboard modal
        const dashboardModal = document.getElementById('dashboard-modal');
        const closeDashboard = document.getElementById('close-dashboard');
        const disconnectBtn = document.getElementById('disconnect-wallet');

        if (closeDashboard) {
            closeDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideDashboard();
            });
        }

        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.disconnectWallet();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.wallet-section')) {
                if (walletDropdown) {
                    walletDropdown.classList.add('hidden');
                }
            }
            if (e.target === dashboardModal) {
                this.hideDashboard();
            }
        });

        // Hero buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.textContent.includes('Torneo')) {
                    this.navigateToPage('tournament');
                } else if (btn.textContent.includes('MCL')) {
                    this.navigateToPage('tokenomics');
                }
            });
        });

        // Tournament voting buttons - Fixed
        document.addEventListener('click', (e) => {
            if (e.target.closest('.vote-buttons .btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleVote(e.target);
                return false;
            }
        });

        // Buy MCL button - Fixed
        document.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Compra') && e.target.textContent.includes('MCL')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyMCL();
                return false;
            }
        });

        // Download whitepaper
        document.addEventListener('click', (e) => {
            if (e.target.closest('.download-btn')) {
                e.preventDefault();
                this.handleDownloadWhitepaper();
            }
        });

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // FAQ items (expandable)
        document.querySelectorAll('.faq-item h3').forEach(question => {
            question.style.cursor = 'pointer';
            question.addEventListener('click', (e) => {
                e.preventDefault();
                const answer = question.nextElementSibling;
                const isVisible = answer.style.display === 'block';
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item p').forEach(p => {
                    p.style.display = 'none';
                });
                document.querySelectorAll('.faq-item h3').forEach(h3 => {
                    h3.style.color = 'var(--tournament-orange-primary)';
                });
                
                // Toggle current item
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

        // Contract address copying
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('contract-address')) {
                e.preventDefault();
                this.copyToClipboard(e.target.textContent.trim());
                this.showNotification('Indirizzo contratto copiato!', 'success');
            }
        });
    }

    setupCarousel() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const indicators = document.querySelectorAll('.indicator');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
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

    startTournamentTimer() {
        this.updateTournamentTimer();
        this.tournamentTimer = setInterval(() => {
            this.updateTournamentTimer();
        }, 1000);
    }

    updateTournamentTimer() {
        const now = new Date();
        const utcTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const currentDay = utcTime.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = utcTime.getUTCHours();

        let phase, phaseTitle, timeRemaining, description;

        // Determine current tournament phase
        if (currentDay === 3 && currentHour >= 22) {
            // Wednesday 22:00+ - Round of 16
            phase = 'roundOf16';
            phaseTitle = 'Ottavi di Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCDate(nextPhase.getUTCDate() + 1);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine degli ottavi di finale';
        } else if (currentDay === 4 && (currentHour < 22)) {
            // Thursday before 22:00 - Round of 16
            phase = 'roundOf16';
            phaseTitle = 'Ottavi di Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine degli ottavi di finale';
        } else if (currentDay === 4 && currentHour >= 22) {
            // Thursday 22:00+ - Quarter Finals
            phase = 'quarterFinals';
            phaseTitle = 'Quarti di Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCDate(nextPhase.getUTCDate() + 1);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine dei quarti di finale';
        } else if (currentDay === 5 && currentHour < 22) {
            // Friday before 22:00 - Quarter Finals
            phase = 'quarterFinals';
            phaseTitle = 'Quarti di Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine dei quarti di finale';
        } else if (currentDay === 5 && currentHour >= 22) {
            // Friday 22:00+ - Semi Finals
            phase = 'semiFinals';
            phaseTitle = 'Semifinali';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCDate(nextPhase.getUTCDate() + 1);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine delle semifinali';
        } else if (currentDay === 6 && currentHour < 22) {
            // Saturday before 22:00 - Semi Finals
            phase = 'semiFinals';
            phaseTitle = 'Semifinali';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine delle semifinali';
        } else if (currentDay === 6 && currentHour >= 22) {
            // Saturday 22:00+ - Finals
            phase = 'finals';
            phaseTitle = 'Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCDate(nextPhase.getUTCDate() + 1);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine della finale';
        } else if (currentDay === 0 && currentHour < 22) {
            // Sunday before 22:00 - Finals
            phase = 'finals';
            phaseTitle = 'Finale';
            const nextPhase = new Date(utcTime);
            nextPhase.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextPhase - utcTime;
            description = 'Tempo rimanente per la fine della finale';
        } else {
            // Break period
            phase = 'break';
            phaseTitle = 'Il torneo non è ancora iniziato';
            // Calculate time until next Wednesday 22:00
            const nextWednesday = new Date(utcTime);
            const daysUntilWednesday = (3 - currentDay + 7) % 7 || 7;
            nextWednesday.setUTCDate(nextWednesday.getUTCDate() + daysUntilWednesday);
            nextWednesday.setUTCHours(22, 0, 0, 0);
            timeRemaining = nextWednesday - utcTime;
            description = 'Tempo rimanente fino al prossimo torneo';
        }

        // Update UI elements
        const phaseTitleElement = document.getElementById('tournament-phase-title');
        const timerHours = document.getElementById('timer-hours');
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSeconds = document.getElementById('timer-seconds');
        const timerDescription = document.getElementById('timer-description');

        if (phaseTitleElement) phaseTitleElement.textContent = phaseTitle;
        if (timerDescription) timerDescription.textContent = description;

        if (timeRemaining > 0 && timerHours && timerMinutes && timerSeconds) {
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            timerHours.textContent = hours.toString().padStart(2, '0');
            timerMinutes.textContent = minutes.toString().padStart(2, '0');
            timerSeconds.textContent = seconds.toString().padStart(2, '0');
        }
    }

    async connectWallet(walletType) {
        try {
            this.showLoading(document.getElementById('connect-wallet'), 3000);
            
            let wallet;
            
            switch (walletType) {
                case 'phantom':
                    if (window.solana && window.solana.isPhantom) {
                        wallet = window.solana;
                    } else {
                        this.showNotification('Phantom Wallet non trovato. Installalo da phantom.app', 'error');
                        return;
                    }
                    break;
                    
                case 'solflare':
                    if (window.solflare && window.solflare.isSolflare) {
                        wallet = window.solflare;
                    } else {
                        this.showNotification('Solflare Wallet non trovato. Installalo da solflare.com', 'error');
                        return;
                    }
                    break;
                    
                case 'slope':
                    if (window.Slope) {
                        wallet = new window.Slope();
                    } else {
                        this.showNotification('Slope Wallet non trovato. Installalo da slope.finance', 'error');
                        return;
                    }
                    break;
                    
                case 'backpack':
                    if (window.backpack) {
                        wallet = window.backpack;
                    } else {
                        this.showNotification('Backpack Wallet non trovato. Installalo da backpack.app', 'error');
                        return;
                    }
                    break;
                    
                default:
                    // Fallback to simulation
                    this.simulateWalletConnection(walletType);
                    return;
            }

            // Attempt real wallet connection
            const response = await wallet.connect();
            
            this.isWalletConnected = true;
            this.currentWallet = walletType;
            this.walletAddress = response.publicKey.toString();
            
            this.showNotification(`${walletType} connesso con successo!`, 'success');
            this.updateWalletUI();
            
            // Fetch real balances if possible
            await this.fetchWalletBalances();
            
            setTimeout(() => {
                this.showDashboard();
            }, 1500);
            
        } catch (error) {
            console.warn('Real wallet connection failed, using simulation:', error);
            this.simulateWalletConnection(walletType);
        }
    }

    simulateWalletConnection(walletType) {
        // Simulate wallet connection for demo purposes
        this.isWalletConnected = true;
        this.currentWallet = walletType;
        this.walletAddress = this.generateMockAddress();
        
        this.showNotification(`${walletType} connesso (modalità demo)!`, 'success');
        this.updateWalletUI();
        
        setTimeout(() => {
            this.showDashboard();
        }, 1500);
    }

    generateMockAddress() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let result = '';
        for (let i = 0; i < 44; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async fetchWalletBalances() {
        if (!this.connection || !this.walletAddress) return;

        try {
            const publicKey = new window.solanaWeb3.PublicKey(this.walletAddress);
            const balance = await this.connection.getBalance(publicKey);
            const solBalance = (balance / window.solanaWeb3.LAMPORTS_PER_SOL).toFixed(2);
            
            this.mockBalances.solana = solBalance;
            
            // Mock MCL balance for demo
            this.mockBalances.mcl = (Math.random() * 10000).toFixed(2);
            
        } catch (error) {
            console.warn('Could not fetch real balances:', error);
        }
    }

    disconnectWallet() {
        this.isWalletConnected = false;
        this.currentWallet = null;
        this.walletAddress = null;
        this.updateWalletUI();
        this.hideDashboard();
        this.showNotification('Wallet disconnesso', 'info');
    }

    updateWalletUI() {
        const connectBtn = document.getElementById('connect-wallet');
        
        if (this.isWalletConnected) {
            connectBtn.innerHTML = `<i class="fas fa-user-circle"></i> Dashboard`;
            connectBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else {
            connectBtn.innerHTML = `<i class="fas fa-wallet"></i> Connetti Wallet`;
            connectBtn.style.background = 'linear-gradient(135deg, var(--tournament-orange-primary), var(--tournament-orange-secondary))';
        }
    }

    showDashboard() {
        if (!this.isWalletConnected) {
            this.showNotification('Connetti prima il tuo wallet', 'warning');
            return;
        }

        const modal = document.getElementById('dashboard-modal');
        const walletAddress = document.getElementById('wallet-address');
        const solanaBalance = document.getElementById('solana-balance');
        const mclBalance = document.getElementById('mcl-balance');

        // Update wallet info
        if (walletAddress) {
            walletAddress.textContent = this.walletAddress || 'Non disponibile';
        }
        if (solanaBalance) solanaBalance.textContent = `${this.mockBalances.solana} SOL`;
        if (mclBalance) mclBalance.textContent = `${this.mockBalances.mcl} MCL`;

        modal.classList.remove('hidden');
        
        // Add animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    hideDashboard() {
        const modal = document.getElementById('dashboard-modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }

    async handleVote(button) {
        if (!this.isWalletConnected) {
            this.showNotification('Connetti il tuo wallet per votare', 'warning');
            // Show wallet dropdown automatically
            const walletDropdown = document.getElementById('wallet-dropdown');
            if (walletDropdown) {
                walletDropdown.classList.remove('hidden');
            }
            return;
        }

        const stakeInput = document.querySelector('.stake-input');
        const stakeAmount = stakeInput ? stakeInput.value : '0';

        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            this.showNotification('Inserisci un importo valido per lo staking', 'error');
            return;
        }

        const coinName = button.textContent.replace('Vota ', '');
        
        try {
            // Show loading state
            this.showLoading(button, 2000);
            
            // Here would be the actual smart contract interaction
            // For now, we'll simulate it
            await this.simulateStakingTransaction(stakeAmount, coinName);
            
            this.showNotification(`Votato con successo ${stakeAmount} MCL per ${coinName}!`, 'success');
            
            // Update mock balance
            const currentMCL = parseFloat(this.mockBalances.mcl.replace(',', ''));
            this.mockBalances.mcl = Math.max(0, currentMCL - parseFloat(stakeAmount)).toFixed(2);
            
            // Clear input
            if (stakeInput) stakeInput.value = '';
            
            // Update vote counts (visual feedback)
            this.updateVoteCounts(coinName);
            
        } catch (error) {
            this.showNotification('Errore durante il voto: ' + error.message, 'error');
        }
    }

    async simulateStakingTransaction(amount, coin) {
        // Simulate blockchain transaction delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ signature: this.generateMockSignature() });
                } else {
                    reject(new Error('Transazione fallita'));
                }
            }, 1500);
        });
    }

    generateMockSignature() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let result = '';
        for (let i = 0; i < 88; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    updateVoteCounts(votedCoin) {
        document.querySelectorAll('.vote-count').forEach(voteElement => {
            const currentCount = parseInt(voteElement.textContent.match(/\d+/)[0]);
            const coinElement = voteElement.closest('.coin-contestant').querySelector('.coin-name');
            
            if (coinElement && coinElement.textContent === votedCoin) {
                voteElement.textContent = `${currentCount + 1} voti`;
            }
        });
    }

    async handleBuyMCL() {
        if (!this.isWalletConnected) {
            this.showNotification('Connetti il tuo wallet per comprare MCL', 'warning');
            // Show wallet dropdown automatically
            const walletDropdown = document.getElementById('wallet-dropdown');
            if (walletDropdown) {
                walletDropdown.classList.remove('hidden');
            }
            return;
        }

        const buyInput = document.querySelector('.buy-input');
        const solAmount = buyInput ? buyInput.value : '1';

        if (!solAmount || parseFloat(solAmount) <= 0) {
            this.showNotification('Inserisci un importo SOL valido', 'error');
            return;
        }

        try {
            const mclAmount = parseFloat(solAmount) * 2000; // 1 SOL = 2000 MCL
            
            // Simulate purchase transaction
            await this.simulatePurchaseTransaction(solAmount, mclAmount);
            
            this.showNotification(`Acquistati con successo ${mclAmount.toLocaleString()} MCL per ${solAmount} SOL!`, 'success');
            
            // Update mock balances
            const currentSOL = parseFloat(this.mockBalances.solana);
            const currentMCL = parseFloat(this.mockBalances.mcl);
            
            this.mockBalances.solana = Math.max(0, currentSOL - parseFloat(solAmount)).toFixed(2);
            this.mockBalances.mcl = (currentMCL + mclAmount).toFixed(2);
            
            // Clear input
            if (buyInput) buyInput.value = '';
            
        } catch (error) {
            this.showNotification('Errore durante l\'acquisto: ' + error.message, 'error');
        }
    }

    async simulatePurchaseTransaction(solAmount, mclAmount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.05) { // 95% success rate
                    resolve({ signature: this.generateMockSignature() });
                } else {
                    reject(new Error('Transazione fallita'));
                }
            }, 2000);
        });
    }

    handleDownloadWhitepaper() {
        // Simulate PDF download
        this.showNotification('Scaricamento whitepaper in corso...', 'info');
        
        // Create a mock download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovTGVuZ3RoIDYgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nDPQM1Qo5ypUKOEm5Lw==';
            link.download = 'MCL_Whitepaper_v1.0.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Whitepaper scaricato con successo!', 'success');
        }, 1500);
    }

    handleContactForm(form) {
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;

        if (!name || !email || !message) {
            this.showNotification('Compila tutti i campi', 'error');
            return;
        }

        // Simulate form submission
        this.showLoading(form.querySelector('button[type="submit"]'), 2000);
        
        setTimeout(() => {
            this.showNotification('Messaggio inviato con successo! Ti risponderemo presto.', 'success');
            form.reset();
        }, 2000);
    }

    navigateToPage(pageName) {
        console.log('Navigating to:', pageName); // Debug log
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Showing page:', pageName); // Debug log
        } else {
            console.warn('Page not found:', pageName); // Debug log
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageName;

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.warn('Could not copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

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
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
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

    showLoading(element, duration = 2000) {
        const originalText = element.textContent;
        const originalDisabled = element.disabled;
        
        element.textContent = 'Caricamento...';
        element.disabled = true;
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.disabled = originalDisabled;
            element.style.opacity = '1';
        }, duration);
    }

    updateTournamentData() {
        // Update live tournament data (placeholder for real implementation)
        const mockData = {
            totalStaked: (Math.random() * 50000 + 40000).toFixed(2),
            activeVoters: Math.floor(Math.random() * 1000 + 2000),
        };

        // Update display elements
        document.querySelectorAll('.stat-value').forEach(element => {
            if (element.textContent.includes('$')) {
                element.textContent = `$${mockData.totalStaked}`;
            } else if (!element.textContent.includes('Q')) {
                element.textContent = mockData.activeVoters.toLocaleString();
            }
        });
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Adjust carousel for mobile
        if (isMobile) {
            document.querySelectorAll('.carousel-btn').forEach(btn => {
                btn.style.position = 'relative';
                btn.style.margin = '10px';
            });
        }
    }

    // Cleanup method
    destroy() {
        if (this.tournamentTimer) {
            clearInterval(this.tournamentTimer);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MemeTournamentApp();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        app.handleResize();
    });
    
    // Update tournament data every 30 seconds
    setInterval(() => {
        app.updateTournamentData();
    }, 30000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
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
    document.querySelectorAll('.feature-card, .stat-card, .team-member, .roadmap-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        app.destroy();
    });
    
    console.log('MemeTournament App con integrazione Solana inizializzata con successo!');
    
    // Global app instance for debugging
    window.memeTournamentApp = app;
});
