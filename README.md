# Go Gold Counseling Practice — Stage 1 pilot

A React + TypeScript + Vite feasibility test for Vanderbilt Army ROTC cadets. Real local WebLLM inference runs in a Web Worker. No backend, account, API key, paid service, analytics, or transcript database. This is development practice, not official grading, discipline, or an endorsed Army/Vanderbilt product.

**The five-case inference test failed: 0/5 reports passed output validation. Stage 2 is deferred.** See the verification report for evidence and recommended adjustments. The pilot includes the metadata needed to evaluate the right speaker, five fixtures, GPU checks, explicit model loading/progress, cancellation, evidence validation, and clearing. The full Stage 2 workspace, print action and prompt-copy fallback are deferred until quality passes. Browser print can still print the report. Nothing has been published.

## Run locally

Install Node.js 22.12+ (22.16 tested), then:

```sh
npm ci
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:5173 in a current desktop Chrome or Edge with WebGPU and GPU acceleration. HTTPS or localhost is required; opening index.html directly is unsupported. A successful GPU adapter check does not guarantee memory capacity or compatibility. Mobile, Safari, Firefox, and devices without WebGPU have not been validated. No remote-AI fallback is used.

1. Choose a fictional scenario.
2. Click **Load local AI** and wait for **Local AI ready**. First load downloads model/runtime artifacts; subsequent loads may use browser caches.
3. Click **Analyze locally**. Generation can take minutes. Only a complete, validated report is displayed. Alternatively, **Run five feasibility cases** runs all fixtures sequentially and lists validation outcomes; it replaces the current input with fictional fixtures and is not a semantic quality pass.
4. Compare against the expected observations in [the browser test protocol](docs/BROWSER-TEST.md).
5. **Stop generation** terminates the worker and discards partial results. Reload AI before trying again.
6. **Clear session** clears inputs/results, terminates the worker (including its KV cache), and releases the model. Cached model downloads remain.

Label every nonempty line `Speaker: text`, including each email paragraph. The evaluated speaker is an exact, case-sensitive label. Maximum submission size is **4,500 UTF-8 bytes**, including JSON metadata; no silent truncation. Context is limited to 500 characters. This deliberately small pilot limit leaves room for the rubric and structured response. Byte length is not a tokenizer estimate; runtime context errors still fail visibly.

## Model and dependencies

Pinned `@mlc-ai/web-llm@0.2.85`; all direct dependencies are exact versions and `package-lock.json` locks the dependency tree. Model: `Qwen2.5-1.5B-Instruct-q4f32_1-MLC`. Confirmed in the installed version's `prebuiltAppConfig.model_list` on 2026-10-08. This small instruction model is a laptop-oriented starting point, not a demonstrated quality claim. Float32 avoids requiring shader-f16 support.

Budget roughly **1–1.5 GB downloads** and **3–4 GB available memory including browser overhead**, not measured guarantees. The registry lists 1,888.97 MB VRAM at its default 4,096-token context. This pilot requests 16,384 tokens to accommodate rubric/input/output, so memory can be higher. Other tabs, adapter limits and browser overhead matter. Model files are upstream-hosted and are not vendored or revision-pinned; package pinning does not freeze upstream model artifacts.

Verified API sources: [official worker documentation](https://webllm.mlc.ai/docs/user/advanced_usage.html#using-web-workers), [official model registry](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts), [MLC model repository](https://huggingface.co/mlc-ai/Qwen2.5-1.5B-Instruct-q4f32_1-MLC). The Vite worker URL uses `new URL('./worker.ts', import.meta.url)`; `base: './'` makes built assets work beneath a repository subpath.

## Rubric and limitations

- [Separate rubric](src/rubric.ts): source references per criterion.
- [Evaluation prompt and validators](src/evaluation.ts): separate from interface code.
- [Fictional scenarios and expected distinctions](src/scenarios.ts).
- [Source notes](docs/SOURCES.md), [verification report](docs/VERIFICATION.md).

Structured output is parsed strictly. All 11 rubric checks and exactly three priorities are required. Every evidence quote must occur exactly in the submission AND within a selected-speaker line. Unknown fields and incomplete generation fail closed; no canned feedback replaces failures. This checks string attribution, not whether a model interpreted the evidence correctly. Explanations, paraphrases and suggestions still need human review. Instructions in submitted text are untrusted; a system prompt reduces injection risk but cannot prove immunity. A quote included inside an instruction is not necessarily evidence of a counseling technique.

The selected speaker may be either participant; only their conduct is evaluated. Paperwork/notification silence is not noncompliance. OARS is user-specified, not defined by TC paragraphs 2-117–2-134. Officer–NCO criteria require scenario relevance, not merely cadet MS levels.

## Privacy

Transcripts/results are React state and worker memory only. No app logging of submitted data, URL serialization, localStorage, analytics, database, or transcript fetch calls. React renders text without raw HTML. WebLLM logging is set to SILENT. Model/runtime requests go to Hugging Face and GitHub infrastructure; those hosts see normal download request metadata, not the transcript. Download progress comes from WebLLM. Local inference is architecturally separate from downloads; see the network test for runtime verification status. Browser extensions, OS memory/swap, clipboard use and browser behavior are outside the app's guarantees.

Clear session does not delete browser model caches. Use browser settings → site data for the pilot origin to remove cached downloads; clearing downloads is independent of clearing the session. Never paste real sensitive counseling records into this unvalidated pilot.

## GitHub Pages — prepare only

The workflow is **manual (`workflow_dispatch`) only**, with no push trigger. It has not been run. When you explicitly decide to publish:

1. Commit source files and `package-lock.json`, push to your repository.
2. In repository Settings → Pages, choose GitHub Actions as the source.
3. Run **Publish pilot to GitHub Pages (manual only)** from Actions.
4. The workflow uses `npm ci`, runs validation tests/build, uploads `dist`, and deploys it through the `github-pages` environment. Add environment approval protection if desired.
5. Test `https://<owner>.github.io/<repository>/`, especially worker/model loading and asset paths.

No custom backend or secret is needed. Do not publish attached PDFs without reviewing sharing permission; only concise source-derived criteria are included here.
