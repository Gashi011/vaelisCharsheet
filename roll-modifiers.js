/* Global extra dice applied to sheet-triggered rolls. */
state.rollModifier={count:0,die:6,...(state.rollModifier||{})};
const modifierRolls=()=>Array.from({length:Math.max(0,state.rollModifier.count)},()=>1+Math.floor(Math.random()*state.rollModifier.die));
const modifierLabel=()=>state.rollModifier.count>0?`+${state.rollModifier.count}d${state.rollModifier.die}`:'Roll Modifiers';
function updateModifierUi(){$('#rollModifierBtn').textContent=modifierLabel();$('#modifierPreview').textContent=state.rollModifier.count>0?`Every sheet roll gains ${state.rollModifier.count}d${state.rollModifier.die}.`:'Normal roll — no modifier dice'}

const previousModifierBind=bind;
bind=function(){previousModifierBind();$$('[data-roll]').forEach(button=>button.onclick=async e=>{if(state.mode==='edit'&&e.target.closest('[contenteditable="true"]'))return;e.stopPropagation();const extras=modifierRolls(),extraTotal=extras.reduce((sum,value)=>sum+value,0),extraText=extras.length?` + modifier [${extras.join(', ')}]`:'';if(button.dataset.roll==='d20'){const raw=1+Math.floor(Math.random()*20),bonus=Number(button.dataset.bonus),penalty=state.exhaustion<6?state.exhaustion:0,total=raw+bonus-penalty+extraTotal;button.disabled=true;await (window.drawVaelisCard?.(raw,button.dataset.label)||Promise.resolve());button.disabled=false;toast(button.dataset.label,`${raw} ${signed(bonus)}${penalty?' − '+penalty:''}${extraText}`,state.exhaustion===6?'DEAD':total)}else{const match=button.dataset.formula.match(/(\d+)d(\d+)([+-]\d+)?/i);if(!match)return toast('Invalid formula',button.dataset.formula,'—');const rolls=Array.from({length:+match[1]},()=>1+Math.floor(Math.random()*+match[2])),bonus=+(match[3]||0),total=rolls.reduce((sum,value)=>sum+value,0)+bonus+extraTotal;toast(button.dataset.label,`[${rolls.join(', ')}] ${bonus?signed(bonus):''}${extraText}`,total)}})};

function openModifierModal(){$('#modifierCount').value=state.rollModifier.count;$('#modifierDie').value=state.rollModifier.die;updateModifierUi();$('#rollModifierModal').classList.remove('hidden')}
function closeModifierModal(){$('#rollModifierModal').classList.add('hidden')}
$('#rollModifierBtn').onclick=openModifierModal;
$('#closeRollModifier').onclick=closeModifierModal;
$('#rollModifierModal').onclick=e=>{if(e.target===$('#rollModifierModal'))closeModifierModal()};
function previewModifier(){const count=Math.max(0,Number($('#modifierCount').value)||0),die=Number($('#modifierDie').value)||6;$('#modifierPreview').textContent=count>0?`Every sheet roll will gain ${count}d${die}.`:'Normal roll — no modifier dice'}
$('#modifierCount').oninput=previewModifier;$('#modifierDie').onchange=previewModifier;
$('#saveRollModifier').onclick=()=>{state.rollModifier.count=Math.min(20,Math.max(0,Number($('#modifierCount').value)||0));state.rollModifier.die=Number($('#modifierDie').value)||6;save();updateModifierUi();closeModifierModal();render()};
$('#resetRollModifier').onclick=()=>{state.rollModifier={count:0,die:6};save();$('#modifierCount').value=0;$('#modifierDie').value=6;updateModifierUi();closeModifierModal();render()};

updateModifierUi();render();
