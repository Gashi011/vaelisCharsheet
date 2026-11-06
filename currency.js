/* Persistent coin wallet with automatic change-making for spending. */
if(!state.coins){
  state.coins={cp:0,sp:0,gp:14,pp:0,ep:0};
  const legacyCoins=state.equipment.findIndex(item=>/^\s*14\s*GP\s*$/i.test(item.name||''));
  if(legacyCoins>=0)state.equipment.splice(legacyCoins,1);
  save();
}
state.coins={cp:0,sp:0,gp:0,pp:0,ep:0,...state.coins};

const coinTypes=[
  {key:'cp',name:'Copper',mark:'CP'},
  {key:'sp',name:'Silver',mark:'SP'},
  {key:'gp',name:'Gold',mark:'GP'},
  {key:'pp',name:'Platinum',mark:'PP'},
  {key:'ep',name:'Electrum',mark:'EP'}
];

function coinNotice(message){
  const notice=$('#rollToast');
  notice.innerHTML=`<strong>${message}</strong>`;
  notice.classList.add('show');
  clearTimeout(coinNotice.timer);
  coinNotice.timer=setTimeout(()=>notice.classList.remove('show'),2400);
}

function takeGold(wallet){
  if(wallet.gp>0){wallet.gp--;return true}
  if(wallet.pp>0){wallet.pp--;wallet.gp+=9;return true}
  return false;
}

function normalizeCoinDebt(wallet,key){
  if(key==='cp'){
    while(wallet.cp<0){
      if(wallet.sp>0){wallet.sp--;wallet.cp+=10}
      else if(takeGold(wallet)){wallet.sp+=9;wallet.cp+=10}
      else return false;
    }
  }
  if(key==='sp'){
    while(wallet.sp<0){
      if(takeGold(wallet))wallet.sp+=10;
      else return false;
    }
  }
  if(key==='ep'){
    while(wallet.ep<0){
      if(takeGold(wallet))wallet.ep+=2;
      else return false;
    }
  }
  if(key==='gp'){
    while(wallet.gp<0){
      if(wallet.pp>0){wallet.pp--;wallet.gp+=10}
      else return false;
    }
  }
  return wallet.pp>=0;
}

function changeCoins(key,delta){
  const wallet={...state.coins};
  wallet[key]=(Number(wallet[key])||0)+delta;
  if(!normalizeCoinDebt(wallet,key)){
    coinNotice('Nemate dovoljno novca za ovu promenu.');
    renderWallet();
    return;
  }
  state.coins=wallet;
  save();
  renderWallet();
}

function applyCoinInput(input){
  const key=input.dataset.coinInput,raw=input.value.trim(),current=Number(state.coins[key])||0;
  if(!/^[+-]?\d+$/.test(raw)){renderWallet();return}
  const amount=Number(raw);
  changeCoins(key,raw.startsWith('+')||raw.startsWith('-')?amount:amount-current);
}

function renderWallet(){
  $('#coinWallet').innerHTML=coinTypes.map(coin=>`<article class="coin-card coin-${coin.key}">
    <span class="coin-mark">${coin.mark}</span>
    <strong>${coin.name}</strong>
    <div class="coin-control">
      <button type="button" data-coin-step="-1" data-coin-key="${coin.key}" aria-label="Remove one ${coin.name}">↓</button>
      <input type="text" inputmode="numeric" value="${state.coins[coin.key]}" data-coin-input="${coin.key}" aria-label="${coin.name} amount">
      <button type="button" data-coin-step="1" data-coin-key="${coin.key}" aria-label="Add one ${coin.name}">↑</button>
    </div>
  </article>`).join('');
  $$('[data-coin-step]').forEach(button=>button.onclick=()=>changeCoins(button.dataset.coinKey,Number(button.dataset.coinStep)));
  $$('[data-coin-input]').forEach(input=>{
    input.onfocus=()=>input.select();
    input.onchange=()=>applyCoinInput(input);
    input.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();input.blur()}};
  });
}

renderWallet();
