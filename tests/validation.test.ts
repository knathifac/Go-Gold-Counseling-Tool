import { test } from 'node:test';
import assert from 'node:assert/strict';
import {validateInput,validateReport} from '../src/evaluation.ts';
import {rubric} from '../src/rubric.ts';
import {scenarios} from '../src/scenarios.ts';
const input=scenarios[0].input;
// Synthetic validator fixtures only, never displayed as AI feedback.
const observation={criterion:'O',status:'Observed',quote:'What would you like to work on this semester?',explanation:'Invites reflection.',suggestion:''};
function fixture(){return {speaker:'Alex',overall:'Synthetic validation fixture',strengths:[{...observation}],improvements:[],checks:rubric.map(r=>({criterion:r.id,status:'Not observable',quote:'',explanation:'Not assessed in this synthetic test.',suggestion:''})),priorities:['One','Two','Three']};}
test('all fictional inputs satisfy explicit size and speaker limits',()=>scenarios.forEach(s=>validateInput(s.input)));
test('valid exact selected-speaker evidence passes',()=>assert.equal(validateReport(JSON.stringify(fixture()),input).speaker,'Alex'));
test('invented quote rejected',()=>{const r=fixture();r.strengths[0].quote='You are a perfect counselor.';assert.throws(()=>validateReport(JSON.stringify(r),input));});
test('real quote from wrong speaker rejected',()=>{const r=fixture();r.strengths[0].quote='A training partner and a check-in next week.';assert.throws(()=>validateReport(JSON.stringify(r),input));});
test('missing quote, wrong speaker, missing criteria, malformed JSON and extra fields rejected',()=>{
 const noQuote=fixture();noQuote.strengths[0].quote='';assert.throws(()=>validateReport(JSON.stringify(noQuote),input));
 assert.throws(()=>validateReport(JSON.stringify({...fixture(),speaker:'Jordan'}),input));
 assert.throws(()=>validateReport(JSON.stringify({...fixture(),checks:[]}),input));
 assert.throws(()=>validateReport('```json {} ```',input));
 assert.throws(()=>validateReport(JSON.stringify({...fixture(),grade:100}),input));
});
test('byte limit rejects, never truncates unicode or ASCII',()=>{for(const text of ['x'.repeat(4500),'💛'.repeat(1200)])assert.throws(()=>validateInput({...input,transcript:'Alex: '+text}));});
test('ambiguous/unlabeled input rejected',()=>{assert.throws(()=>validateInput({...input,speaker:'Unknown'}));assert.throws(()=>validateInput({...input,transcript:'Unlabeled email'}));});
