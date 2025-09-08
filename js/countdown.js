document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('countdown-container');

  function updateDisplay() {
    const now = new Date();

    // Calcola data target mercoledì 22:00 UTC (giovedì 00:00 CEST)
    const day = now.getUTCDay(); // 0=Sun, 3=Wed
    let daysToWed = (3 - day + 7) % 7;
    let wed22 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysToWed, 22));
    if (now >= wed22) wed22 = new Date(wed22.getTime() + 7*24*60*60*1000);

    // Calcola data target domenica 22:00 UTC (inizio countdown)
    let daysToSun = (0 - day + 7) % 7;
    let sun22 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysToSun, 22));
    if (now >= sun22 || sun22 > wed22) sun22 = new Date(sun22.getTime() - 7*24*60*60*1000);

    // Se siamo fra domenica22 e mercoledì22, mostra il countdown
    if (now >= sun22 && now < wed22) {
      const diff = wed22 - now;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      container.innerHTML = `
        <h2>Next Tournament Round Starts In:</h2>
        <div id="countdown" class="countdown">
          ${days}d ${hours.toString().padStart(2,'0')}h 
          ${minutes.toString().padStart(2,'0')}m 
          ${seconds.toString().padStart(2,'0')}s
        </div>
      `;
    } else {
      container.innerHTML = `
        <a href="tournament.html" class="vote-btn">Vote now</a>
      `;
    }
  }

  updateDisplay();
  setInterval(updateDisplay, 1000);
});
