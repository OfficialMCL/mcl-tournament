// Updated Countdown Script with Days for Meme Coin League Homepage
// Sets countdown to next Thursday 00:00 UTC+2
document.addEventListener('DOMContentLoaded', () => {
    const countdownElem = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date();
        // Compute next Thursday at 00:00 UTC+2
        const target = new Date(now);
        const day = now.getUTCDay(); // Sunday = 0
        const diffDays = (4 - day + 7) % 7;
        target.setUTCDate(now.getUTCDate() + diffDays);
        // Set to Thursday 00:00 UTC+2, which is Wednesday 22:00 UTC
        target.setUTCHours(22, 0, 0, 0);
        if (target <= now) {
            target.setUTCDate(target.getUTCDate() + 7);
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
