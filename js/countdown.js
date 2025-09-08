// Updated Countdown Script: ends next Thursday 00:00 local time (UTC+2 for CEST)
document.addEventListener('DOMContentLoaded', () => {
    const countdownElem = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date();
        // Calculate next Thursday local at 00:00
        const todaysDay = now.getDay(); // Sunday=0, Monday=1,...
        const daysUntilThursday = (4 - todaysDay + 7) % 7;
        let target = new Date(now);
        target.setDate(now.getDate() + daysUntilThursday);
        target.setHours(0, 0, 0, 0); // Next Thursday 00:00 local time
        // If that time has already passed today, go to next week's Thursday
        if (target <= now) {
            target = new Date(now);
            target.setDate(now.getDate() + daysUntilThursday + 7);
            target.setHours(0, 0, 0, 0);
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
