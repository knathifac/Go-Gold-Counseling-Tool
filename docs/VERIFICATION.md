# Verification report — 2026-10-08

**Stage 1 feasibility FAILED for this model/prompt/output contract. Stage 2 is deferred.** Real local inference ran on all five fixtures; zero validated reports were accepted. No external publication occurred.

| Area | Evidence / status |
|---|---|
| Dependencies/build | Exact direct versions + npm lockfile. npm install reported zero vulnerabilities. TypeScript and Vite production build passed. WebLLM adds large (~6 MB each) main/worker bundles; expected build size warning remains. |
| Automated validation | 7 tests passed: all five input fixtures; valid selected-speaker quote; invented/wrong-speaker quote rejection; schema/required evidence/speaker/criteria rejection; malformed JSON/extra fields; byte limits; missing labels. Synthetic test reports are never in UI. |
| WebGPU | Actual local Chrome on macOS: secure context, WebGPU and GPU adapter checks passed. Model reached ready; cached reload progress observed. This is device-specific. |
| Initial inference issue | Grammar-constrained JSON mode raised GrammarMatcherInitError. Removed response_format; prompt requests JSON and the same strict post-validation remains. Initial failures were not counseling quality results. |
| UI | Actual Chrome: sample selection populated labels/context; loading progress, readiness and analysis states observed; failed inference showed an error and no report. Stop-generation was exercised on single and multi-case runs: partial output discarded, inputs retained, controls restored, Analyze disabled, model reload required. Clear session then removed transcript, context, roles, results and feasibility outcomes. Desktop workspace visually reviewed; isolated browser test tab used for the five-case runner. |
| Privacy | Source review: no transcript network calls, URL serialization, local/session storage, telemetry, raw HTML or console logging in app code. WebLLM logLevel SILENT. Worker owns inference; clearing terminates it. Full DevTools network/offline/cache audit remains unverified; do not claim runtime traffic proof. |
| Responsive/accessibility | Semantic labels/fieldset, live status/alert, keyboard focus styles and 620px single-column breakpoint implemented. Desktop screenshot reviewed. 390px viewport reviewed: form stacks in one column; DOM scroll width equals viewport width (390px), with no horizontal overflow. Screen reader and full keyboard pass remain unverified. |
| Hosting | Relative Vite base and module worker URL build successfully; emitted HTML asset references and the worker-relative URL resolve to existing build files. Manual-only Pages workflow prepared. Live Pages deployment and production subpath browser test remain unverified. |

Use BROWSER-TEST.md for exact remaining checks and the per-scenario quality gate. Source-level protections cannot prove semantic accuracy or injection resistance. Complete all five quality cases before Stage 2.

## Actual five-case inference results

Model: Qwen2.5-1.5B-Instruct-q4f32_1-MLC; temperature 0.1; max output 3,600 tokens; 16,384-token context; prompt-requested JSON without grammar mode. One sequential run in an isolated Chrome tab on macOS.

| Fictional case | Observed result |
|---|---|
| Strong mentorship | JSON parsed but required report schema failed. |
| Clear but aggressive | Response was not valid JSON. |
| Friendly but vague | Response was not valid JSON. |
| Incomplete email | JSON parsed but required report schema failed. |
| Rubric override attempt | JSON parsed but required report schema failed. |

All rejected outputs were withheld. No canned report, inferred score or fabricated repair was displayed. Rejected raw content was neither logged nor persisted. This establishes that the model/prompt cannot reliably satisfy this output contract, **not** that all its counseling reasoning is wrong. Exact quotation, role distinction, technique recognition, missing-information handling and injection resistance have not received a semantic pass because no valid report was available for review.

Next adjustment: resolve the WebLLM JSON grammar initialization issue or simplify the structured generation task (for example, fewer observations per inference) while preserving the full rubric across calls and strict post-validation. Then compare a 3B instruction model if memory permits. Do not expand the complete interface until the same five cases pass structural AND human semantic review. Verified next candidate in the installed registry: `Qwen2.5-3B-Instruct-q4f32_1-MLC`, listed at 2,893.64 MB VRAM for its default 4,096-token context (more memory would be needed for this pilot’s 16,384-token context and browser overhead). No alternate model has been downloaded or tested.
