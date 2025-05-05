const phases = [
    { name: 'Inhala', duration: 4000, color: '#A0E7E5', audio: 'audio-inhale' },
    { name: 'Mantén', duration: 4000, color: '#B4F8C8', audio: 'audio-hold' },
    { name: 'Exhala', duration: 6000, color: '#FBE7C6', audio: 'audio-exhale' },
  ];
  
  const FADE_DURATION = 500;
  
  const progressEl = document.getElementById('progress');
  const btn       = document.getElementById('startBtn');
  const phaseEl   = document.getElementById('phaseText');
  let breathing = false;
  
  function playCue(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }
  
  function showPhase(phase) {
    phaseEl.textContent = phase.name;
    phaseEl.classList.remove('opacity-0');
    phaseEl.classList.add('opacity-100');
    playCue(phase.audio);
  }
  
  function hidePhase() {
    phaseEl.classList.remove('opacity-100');
    phaseEl.classList.add('opacity-0');
  }
  
  function animatePhase(duration, fillUp, color) {
    return new Promise(resolve => {
      const start = performance.now();
      function tick(now) {
        if (!breathing) return resolve();
        const t = Math.min((now - start) / duration, 1);
        const angle = fillUp ? t * 360 : (1 - t) * 360;
        progressEl.style.background = 
          `conic-gradient(${color} ${angle}deg, transparent ${angle}deg)`;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }
  
  function holdPhase(duration, color) {
    return new Promise(resolve => {
      const start = performance.now();
      function tick(now) {
        if (!breathing) return resolve();
        progressEl.style.background = 
          `conic-gradient(${color} 360deg, transparent 360deg)`;
        if (now - start < duration) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }
  
  async function startBreathing() {
    if (breathing) {
      breathing = false;
      btn.textContent = 'Iniciar';
      hidePhase();
      return;
    }
  
    breathing = true;
    btn.textContent = 'Detener';
  
    while (breathing) {
      showPhase(phases[0]);
      let tid = setTimeout(hidePhase, phases[0].duration - FADE_DURATION);
      await animatePhase(phases[0].duration, true, phases[0].color);
      clearTimeout(tid); hidePhase();
      if (!breathing) break;
  
      showPhase(phases[1]);
      tid = setTimeout(hidePhase, phases[1].duration - FADE_DURATION);
      await holdPhase(phases[1].duration, phases[1].color);
      clearTimeout(tid); hidePhase();
      if (!breathing) break;
  
      showPhase(phases[2]);
      tid = setTimeout(hidePhase, phases[2].duration - FADE_DURATION);
      await animatePhase(phases[2].duration, false, phases[2].color);
      clearTimeout(tid); hidePhase();
    }
  
    progressEl.style.background = '';
    hidePhase();
  }
  
  btn.addEventListener('click', startBreathing);
  