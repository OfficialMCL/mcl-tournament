// Countdown Script for Meme Coin League Homepage
// Sets countdown to next Thursday 00:00 UTC+2
document.addEventListener('DOMContentLoaded', () => {
    const countdownElem = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date();
        // Compute next Thursday at 00:00 UTC+2
        const target = new Date(now);
        // Day 4 = Thursday (0 Sunday)
        const day = now.getUTCDay();
        // Hours difference: set to 00:00 UTC+2 -> UTC time 22:00 previous day
        // So target UTC = Thursday 22:00 UTC
        const diffDays = (4 - day + 7) % 7;
        target.setUTCDate(now.getUTCDate() + diffDays);
        target.setUTCHours(22, 0, 0, 0);

        if (target <= now) {
            target.setUTCDate(target.getUTCDate() + 7);
        }

        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElem.textContent =
            `${hours.toString().padStart(2, '0')}h ` +
            `${minutes.toString().padStart(2, '0')}m ` +
            `${seconds.toString().padStart(2, '0')}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
