/* Editable built-in resources and temporary hit points. */
state.tempHp=Math.max(0,Number(state.tempHp)||0);
state.steelUsed=Number.isInteger(state.steelUsed)?state.steelUsed:(state.steel?1:0);
state.builtinResources={
 bardic:{name:'Bardic Inspiration',max:null,recovery:null,...(state.builtinResources?.bardic||{})},
 steel:{name:'Steel Yourself',max:1,recovery:'long',...(state.builtinResources?.steel||{})}
};
const builtinValue=(type,key)=>{
 const resource=state.builtinResources[type];
 if(resource[key]!==null&&resource[key]!==undefined)return resource[key];
 if(type==='bardic'&&key==='max')return Math.max(1,mod(state.scores.Charisma));
 if(type==='bardic'&&key==='recovery')return state.level>=5?'short':'long';
 return key==='max'?1:'long';
};

const previousPlusRenderResources=renderResources;
renderResources=function(){
 previousPlusRenderResources();
 $('#tempHp').textContent=state.tempHp;
 const bardic=state.builtinResources.bardic;
 const bardicMax=builtinValue('bardic','max');
 const bardicRecovery=builtinValue('bardic','recovery');
 state.bardic=Math.min(state.bardic,bardicMax);
 $('#bardicResource').innerHTML=`<div><strong>${bardic.name}</strong><small id="bardicRecovery">${bardicDie()} · ${recoveryLabels[bardicRecovery]}</small></div><div id="bardicPips" class="pips">${state.mode==='edit'?`<span class="resource-count">${bardicMax-state.bardic}/${bardicMax}</span><button class="outline resource-edit-button" data-edit-builtin="bardic">Edit</button>`:`<span class="resource-count">${bardicMax-state.bardic}/${bardicMax}</span>${Array.from({length:bardicMax},(_,i)=>`<button class="pip ${i<state.bardic?'used':''}" data-builtin-pip="bardic" data-pip="${i}"></button>`).join('')}`}</div>`;
 const steel=state.builtinResources.steel;
 const steelMax=builtinValue('steel','max');
 const steelRecovery=builtinValue('steel','recovery');
 state.steelUsed=Math.min(state.steelUsed,steelMax);
 $('#steelResource').innerHTML=`<div><strong>${steel.name}</strong><small>Reaction · ${recoveryLabels[steelRecovery]}</small></div><div class="pips">${state.mode==='edit'?`<span class="resource-count">${steelMax-state.steelUsed}/${steelMax}</span><button class="outline resource-edit-button" data-edit-builtin="steel">Edit</button>`:`<span class="resource-count">${steelMax-state.steelUsed}/${steelMax}</span>${Array.from({length:steelMax},(_,i)=>`<button class="pip ${i<state.steelUsed?'used':''}" data-builtin-pip="steel" data-pip="${i}"></button>`).join('')}`}</div>`;
};

openResourceForm=function(index=null,type=''){
 const form=$('#resourceForm');
 $('#resourceEditIndex').value=index===null?'':String(index);
 $('#resourceEditType').value=type;
 if(type){const r=state.builtinResources[type];$('#resourceName').value=r.name;$('#resourceMax').value=builtinValue(type,'max');$('#resourceRecovery').value=builtinValue(type,'recovery')}
 else if(index===null){$('#resourceName').value='';$('#resourceMax').value=1;$('#resourceRecovery').value='long'}
 else{const r=state.resources[index];$('#resourceName').value=r.name;$('#resourceMax').value=r.max;$('#resourceRecovery').value=r.recovery||'none'}
 form.classList.remove('hidden');$('#resourceName').focus();
};
$('#addResource').onclick=()=>openResourceForm();
$('#cancelResource').onclick=()=>{$('#resourceForm').classList.add('hidden');$('#resourceEditIndex').value='';$('#resourceEditType').value=''};
$('#resourceForm').onsubmit=e=>{
 e.preventDefault();
 const name=$('#resourceName').value.trim(),max=Math.max(1,Number($('#resourceMax').value)||1),recovery=$('#resourceRecovery').value,index=$('#resourceEditIndex').value,type=$('#resourceEditType').value;
 if(!name)return;
 if(type){Object.assign(state.builtinResources[type],{name,max,recovery});if(type==='bardic')state.bardic=Math.min(state.bardic,max);if(type==='steel')state.steelUsed=Math.min(state.steelUsed,max)}
 else if(index==='')state.resources.push({name,max,used:0,recovery});
 else{const r=state.resources[Number(index)];Object.assign(r,{name,max,recovery,used:Math.min(r.used,max)})}
 e.target.classList.add('hidden');$('#resourceEditIndex').value='';$('#resourceEditType').value='';save();render();
};

const previousPlusBindExtra=bindExtra;
bindExtra=function(){
 previousPlusBindExtra();
 $$('[data-edit-builtin]').forEach(button=>button.onclick=()=>openResourceForm(null,button.dataset.editBuiltin));
 $$('[data-builtin-pip]').forEach(button=>button.onclick=()=>{const type=button.dataset.builtinPip,index=+button.dataset.pip;if(type==='bardic')state.bardic=index<state.bardic?index:index+1;else state.steelUsed=index<state.steelUsed?index:index+1;save();render()});
 $$('[data-temp-hp]').forEach(button=>button.onclick=()=>{state.tempHp=Math.max(0,state.tempHp+(button.dataset.tempHp==='+'?1:-1));save();render()});
};

restoreShortRestResources=function(){state.resources.forEach(r=>{if(r.recovery==='short')r.used=0});if(builtinValue('bardic','recovery')==='short')state.bardic=0;if(builtinValue('steel','recovery')==='short')state.steelUsed=0};
restoreLongRestResources=function(){Object.keys(state.slots).forEach(level=>state.slots[level]=0);state.resources.forEach(r=>{if(r.recovery==='short'||r.recovery==='long')r.used=0});if(['short','long'].includes(builtinValue('bardic','recovery')))state.bardic=0;if(['short','long'].includes(builtinValue('steel','recovery')))state.steelUsed=0;state.steel=state.steelUsed>0;state.hitDie=false;state.hitDiceSpent=0;state.tempHp=0};

$$('[data-hp]').forEach(button=>button.onclick=()=>{if(button.dataset.hp==='-'){if(state.tempHp>0)state.tempHp--;else state.hp=Math.max(0,state.hp-1)}else state.hp=Math.min(state.maxHp,state.hp+1);save();render()});
render();
