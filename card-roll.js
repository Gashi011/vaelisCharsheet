/* Vaelis's d20 deck: every d20 test is resolved by drawing one card numbered 1–20. */
(()=>{
  const symbols=['☾','✦','◈','✧','♠','♣','♥','♦'];
  let active=false;
  function cardMarkup(number,extra=''){
    const symbol=symbols[(number-1)%symbols.length];
    return `<div class="fate-card ${extra}" aria-hidden="true"><span class="fate-corner">${number}</span><i>${symbol}</i><strong>${number}</strong><em>${symbol}</em><span class="fate-corner fate-corner-bottom">${number}</span></div>`;
  }
  window.drawVaelisCard=function(number,label='D20 roll'){
    if(active)return Promise.resolve();
    active=true;
    document.querySelector('.fate-roll-overlay')?.remove();
    const overlay=document.createElement('div');
    overlay.className='fate-roll-overlay';
    overlay.setAttribute('role','status');
    overlay.setAttribute('aria-live','polite');
    overlay.innerHTML=`<div class="fate-vignette"></div><div class="fate-stage"><div class="fate-caption">Elaria's deck</div><div class="fate-shuffle">${[7,13,3,18,10,5].map((n,i)=>cardMarkup(n,`shuffle-card shuffle-${i+1}`)).join('')}</div><div class="fate-drawn">${cardMarkup(number,'drawn-card')}<small>${label}</small></div></div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>overlay.classList.add('is-playing'));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealDelay=reduced?80:1050,finishDelay=reduced?500:2250;
    return new Promise(resolve=>{
      setTimeout(()=>overlay.classList.add('show-result'),revealDelay);
      setTimeout(()=>{overlay.classList.add('is-leaving');setTimeout(()=>overlay.remove(),reduced?80:350);active=false;resolve()},finishDelay);
    });
  };
})();
