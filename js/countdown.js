document.addEventListener('DOMContentLoaded', () => {
  const countdownElem = document.getElementById('countdown');

  function updateCountdown() {
    const now = new Date();

    // Calcola quante ore mancano a mercoledì alle 22:00 UTC (giovedì 00:00 CEST)
    const day = now.getUTCDay(); // 0 = domenica, 3 = mercoledì
    let daysUntilWednesday = (3 - day + 7) % 7;

    // Data target: mercoledì prossimo alle 22:00 UTC
    let target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilWednesday, 22, 0, 0));

    // Se siamo già passati all'orario target, passa alla settimana prossima
    if (target <= now) {
      target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilWednesday + 7, 22, 0, 0));
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
