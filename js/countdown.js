document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('countdown-container');

    function updateDisplay() {
        const now = new Date();

        const day = now.getUTCDay(); // domenica=0, mercoledì=3
        const hour = now.getUTCHours();

        // Calcolo orari chiave in UTC
        // Domenica 22:00 UTC (inizio countdown)
        let daysUntilSunday22 = (0 - day + 7) % 7;
        let sunday22 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilSunday22, 22, 0, 0));

        // Mercoledì 22:00 UTC (fine countdown)
        let daysUntilWed22 = (3 - day + 7) % 7;
        let wed22 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilWed22, 22, 0, 0));

        // Se la data di riferimento è passata, sposta alla prossima settimana
        if (now >= wed22) wed22 = new Date(wed22.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (now >= sunday22) sunday22 = new Date(sunday22.getTime() + 7 * 24 * 60 * 60 * 1000);

        if (now >= sunday22 && now < wed22) {
            // Da domenica 22 a mercoledì 22 mostra il countdown
            const diff = wed22 - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            container.innerHTML = `
                <div id="countdown" class="countdown">${days}d ${hours.toString().padStart(2,'0')}h ${minutes.toString().padStart(2,'0')}m ${seconds.toString().padStart(2,'0')}s</div>
                <p class="announcement">Get ready! The tournament is about to begin.</p>
            `;
        } else {
            // Da mercoledì 22 a domenica 22 mostra il pulsante Vote now
            container.innerHTML = `
                <a href="tournament.html" class="vote-btn">Vote now</a>
            `;
        }
    }

    updateDisplay();
    setInterval(updateDisplay, 1000);
});
