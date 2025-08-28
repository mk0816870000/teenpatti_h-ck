
    function showInputs() {
      const id = document.getElementById('gameId').value.trim();
      if (id) {
        document.getElementById('resultSection').style.display = 'block';
      }
    }

    function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.pitch = 0.7;
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    }

    function predictResult() {
      const values = [
        document.getElementById('res1').value.trim().toUpperCase(),
        document.getElementById('res2').value.trim().toUpperCase(),
        document.getElementById('res3').value.trim().toUpperCase(),
        document.getElementById('res4').value.trim().toUpperCase()
      ];
      if (!values.every(v => v === 'T' || v === 'D')) {
        alert("Enter only 'T' or 'D' in the fields.");
        return;
      }

      let countdown = 3;
      const countdownEl = document.getElementById('countdown');
      const interval = setInterval(() => {
        countdownEl.innerText = `⏳ Predicting in ${countdown}s...`;
        if (--countdown < 0) {
          clearInterval(interval);
          countdownEl.innerText = "";

          // AI-like prediction logic (based on previous pattern)
          const tCount = values.filter(v => v === 'T').length;
          const dCount = values.filter(v => v === 'D').length;
          const pattern = values.join('');

          let prediction;
          if (tCount === 4) prediction = 'D';
          else if (dCount === 4) prediction = 'T';
          else if (pattern === 'TDTD' || pattern === 'DTDT') prediction = 'T';
          else if (tCount > dCount) prediction = 'D';
          else if (dCount > tCount) prediction = 'T';
          else prediction = pattern.endsWith('T') ? 'D' : 'T';

          document.getElementById('predictionText').innerText = `📊 NEXT WINNER: ${prediction}`;
          speak(`Next winner is ${prediction}`);
          logPrediction(prediction);
        }
      }, 1000);
    }

    function logPrediction(result) {
      const id = document.getElementById('gameId').value.trim();
      const logs = document.getElementById('logs');
      const time = new Date().toLocaleTimeString();
      const entry = `🕒 [${time}] Game ID ${id || 'unknown'} — Predicted: ${result} ✅`;
      logs.innerHTML = entry + '<br>' + logs.innerHTML;
    }

    function copyRefer() {
      const gameId = document.getElementById('gameId').value;
      const link = `${window.location.origin}?ref=${gameId || 'YOUR_ID'}`;
      navigator.clipboard.writeText(link);
      alert("Refer link copied: " + link);
    }

    let visitorCount = 7;
    function updateVisitorCount() {
      const change = Math.random() < 0.5 ? -1 : 1;
      visitorCount += change;
      if (visitorCount < 50) visitorCount = 50;
      if (visitorCount > 520) visitorCount = 520;
      document.getElementById("liveVisitors").innerText = `👁️ ${visitorCount} Live Visitors`;
    }
    setInterval(updateVisitorCount, 3000);

    // Add to Home Screen prompt (PWA)
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const addBtn = document.createElement('button');
      addBtn.textContent = '📲 Add to Home Screen';
      addBtn.style.cssText = 'background:lime;color:black;padding:10px;margin-top:10px;border:none;border-radius:5px;';
      addBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          addBtn.remove();
        });
      };
      document.body.insertBefore(addBtn, document.getElementById('resultSection'));
    });
  