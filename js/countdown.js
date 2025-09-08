document.addEventListener('DOMContentLoaded', () => {
    const countdownElem = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date();

        // Calcola il prossimo giovedì alle 22:00 UTC (equivale a giovedì 00:00 CEST)
        const day = now.getUTCDay(); // 0=Sunday, 4=Thursday
        let daysUntilThursday = (4 - day + 7) % 7;
        let target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilThursday, 22, 0, 0));

        if (target <= now) {
            // Se il tempo è già passato, prendi la prossima settimana
            target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilThursday + 7, 22, 0, 0));
        }

        const diff = target - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElem.textContent =
            `${days}d ${hours.toString().padStart(2, '0')}h ` +
            `${minutes.toString().padStart(2, '0')}m ` +
            `${seconds.toString().padStart(2, '0')}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
