/* Short and Long Rest workflow. */
state.hitDiceSpent=Number.isInteger(state.hitDiceSpent)?state.hitDiceSpent:(state.hitDie?1:0);
let pendingHealing=0,healingApplied=false;
const bardicDie=()=>state.level>=15?'d12':state.level>=10?'d10':state.level>=5?'d8':'d6';
const availableHitDice=()=>Math.max(0,state.level-state.hitDiceSpent);

const previousRestRenderResources=renderResources;
renderResources=function(){previousRestRenderResources();const available=availableHitDice();$('#hitDiceLabel').textContent=`${available} of ${state.level} d8 available`;$('#hitDicePips').innerHTML=`<span class="resource-count">${available}/${state.level}</span>`+Array.from({length:state.level},(_,i)=>`<span class="pip display-only ${i<state.hitDiceSpent?'used':''}"></span>`).join('');$('#bardicRecovery').textContent=`${bardicDie()} · ${state.level>=5?'Short or Long Rest':'Long Rest'}`};

function showRestChoice(){$('#restChoice').classList.remove('hidden');$('#shortRestPanel').classList.add('hidden');$('#longRestPanel').classList.add('hidden')}
function openRest(){$('#restModal').classList.remove('hidden');showRestChoice()}
function closeRest(){$('#restModal').classList.add('hidden')}
function openShortRest(){pendingHealing=0;healingApplied=false;$('#restChoice').classList.add('hidden');$('#shortRestPanel').classList.remove('hidden');$('#hitDiceResult').classList.add('hidden');$('#applyHealing').classList.add('hidden');updateShortRestControls()}
function updateShortRestControls(){const available=availableHitDice(),input=$('#hitDiceAmount');$('#hitDiceAvailable').innerHTML=`You have <strong>${available}</strong> of <strong>${state.level}</strong> Hit Dice available. Each die is 1d8 + ${signed(mod(state.scores.Constitution))} Constitution.`;input.max=available;input.value=Math.min(Math.max(0,Number(input.value)||0),available);$('#rollHitDice').disabled=available===0||Number(input.value)===0}
function restoreShortRestResources(){state.resources.forEach(r=>{if(r.recovery==='short')r.used=0});if(state.level>=5)state.bardic=0}
function restoreLongRestResources(){Object.keys(state.slots).forEach(level=>state.slots[level]=0);state.resources.forEach(r=>{if(r.recovery==='short'||r.recovery==='long')r.used=0});state.bardic=0;state.steel=false;state.hitDie=false;state.hitDiceSpent=0}

$('#restBtn').onclick=openRest;
$('#closeRest').onclick=closeRest;
$('#restModal').onclick=e=>{if(e.target===$('#restModal'))closeRest()};
$$('[data-rest-back]').forEach(button=>button.onclick=showRestChoice);
$('#shortRestChoice').onclick=openShortRest;
$('#longRestChoice').onclick=()=>{$('#restChoice').classList.add('hidden');$('#longRestPanel').classList.remove('hidden');$('#longRestResult').classList.add('hidden')};
$('#hitDiceAmount').oninput=updateShortRestControls;
$('#rollHitDice').onclick=()=>{const available=availableHitDice(),amount=Math.min(available,Math.max(0,Number($('#hitDiceAmount').value)||0));if(amount<1)return;const con=mod(state.scores.Constitution),rolls=Array.from({length:amount},()=>1+Math.floor(Math.random()*8)),heals=rolls.map(roll=>Math.max(0,roll+con));pendingHealing=heals.reduce((sum,value)=>sum+value,0);healingApplied=false;state.hitDiceSpent+=amount;save();render();$('#hitDiceResult').innerHTML=`<b>Rolled ${amount} Hit ${amount===1?'Die':'Dice'}</b><span>${rolls.map((roll,i)=>`${roll}${signed(con)} = ${heals[i]}`).join(' · ')}</span><strong>Total healing: ${pendingHealing} HP</strong>`;$('#hitDiceResult').classList.remove('hidden');$('#applyHealing').classList.remove('hidden');$('#applyHealing').disabled=false;$('#applyHealing').textContent='Apply healing to HP';updateShortRestControls()};
$('#applyHealing').onclick=()=>{if(healingApplied||pendingHealing<1)return;const before=state.hp;state.hp=Math.min(state.maxHp,state.hp+pendingHealing);healingApplied=true;save();render();$('#applyHealing').disabled=true;$('#applyHealing').textContent=`Applied +${state.hp-before} HP`};
function showRestConfirmation(message){const notice=$('#rollToast');notice.innerHTML=`<strong>${message}</strong>`;notice.classList.add('show');clearTimeout(showRestConfirmation.timer);showRestConfirmation.timer=setTimeout(()=>notice.classList.remove('show'),2400)}
$('#confirmShortRest').onclick=()=>{restoreShortRestResources();save();render();closeRest();showRestConfirmation('Uspešno ste short restovali.')};
$('#confirmLongRest').onclick=()=>{const restoredHp=$('#restoreHp').checked;restoreLongRestResources();if(restoredHp)state.hp=state.maxHp;else state.inspiration=true;save();render();closeRest();showRestConfirmation('Uspešno ste long restovali.')};

render();
