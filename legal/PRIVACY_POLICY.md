# Privacy Notice: Homeward

> Version 0.4.0 | 2026-11-01 | Matches the built app (1 Nov 2026: live map tiles and rover photos). Add the contact line before submission.

Homeward is a non-commercial student project made for NASA Space Apps 2026. It is not a NASA product.

## What we collect

Nothing that identifies you. There are no accounts, no analytics, no advertising and no tracking cookies.

## What stays in your browser

- Your Marswalk plan, saved in the page address and in your browser's local storage so it survives a reload. Clear it with the Clear plan button in the planner, or by clearing site data.
- Your sound and online-assistant choices.
- Cached app files, Mars data (terrain, imagery, photos, the Mars wind recording) and voice models, so the app works offline.
- The assistant's voice: it is generated on your own device (Kokoro). When offline, speech recognition also runs on your device (Whisper).

## What leaves your browser, and to whom

| When | What | Sent to | Why |
|---|---|---|---|
| You use the microphone in Chrome or Edge while online | Your voice audio, while you hold the talk button | Your browser's speech service (Google, for Chrome) | To turn speech into text |
| You ask the assistant a question while online | The text of your question, the assistant's previous replies in this session, and the numbers our app looked up (position, time, plan budgets) | Our relay (Vercel), which passes it to one of: Google Gemini, Groq, OpenRouter (and the model provider OpenRouter routes to) | To write the answer |
| You choose Kannada or Hindi voice (not available yet; this row applies only if it is added) | The assistant's reply text | Our relay, then Google Gemini | To speak it in that language |
| Any request to our server | The request, with your IP address used briefly for rate limiting | Our host (Vercel) | Security; our logs keep only a short one-way hash of the IP, never the address, and never the text of your questions |
| You look at the globe while online (any imagery except "Offline: our own copy") | Requests for map tiles, which carry your IP address and the area you are looking at | NASA Mars Trek (trek.nasa.gov) and Esri (astro.arcgis.com) | To show sharp orbiter imagery; choose "Offline: our own copy" in Explore, Layers to stop these requests |
| You open Rover view while online | Requests for rover photo records and photos, which carry your IP address | NASA (mars.nasa.gov) | To show the rover's own photos; sent without cookies, and the page sends no referrer with photo requests |

Important: we use free tiers. Google states that content sent to free-tier Gemini models is used to improve its products. Groq and OpenRouter apply their own policies, and OpenRouter's free models are served by third-party providers with their own terms. Do not say anything to the assistant that you would not want a company to read.

You can use the whole app without the microphone (type instead) and without the online assistant: press the cloud button in the assistant bar and every question is answered on your device by the offline assistant, with nothing sent anywhere. Your choice is remembered, and Clear plan does not undo it.

## Children

The app does not ask for or store anyone's personal information. Children using the assistant should do so with a parent or teacher, because questions are processed by the AI providers above under their terms.

## Contact

Team Quickbites, NASA Space Apps 2026, Bengaluru. Contact: [team contact to be added before submission].
