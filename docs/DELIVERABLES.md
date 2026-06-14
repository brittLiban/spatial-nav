
Final Project Overview

The final project is a real AI-enabled application built by a team of 2 to 4 people. Everything you've done this quarter, training models, comparing approaches, building pipelines, deploying inference, comes together here.

The point is to ship something that actually works. A functional proof of concept that you'd genuinely want to use or show someone.
The requirement

Your application needs at least 3 ML-based components working together in a meaningful way. Pretrained models, hosted APIs, and custom-trained pieces all count toward the three. Mixing them is fine and often the right call. What matters is that AI is a major aspect of the app, rather than a small feature bolted on the side.

You have full freedom on tech stack. Python, JavaScript, React, Node, mobile, desktop, whatever fits. Architecture decisions are up to your team.
What "works" means

Your project should:

    Look reasonable. A clean interface, even if minimal. Something you'd be willing to demo.
    Work in the happy path. Walk through your intended use case end to end without crashing.
    Be usable. The core experience should be functional enough that someone could actually try it. Lower-than-production accuracy is fine as long as the app holds together.

Example: a multi-component AI app

Here's a project I built called MTGA-CV-Voice-Interface, which lets you play Magic: The Gathering Arena entirely with voice commands. You say something like "play the lightning bolt" and the app actually moves the cursor and clicks for you.

It uses four ML components stitched together with software:

    STT (speech-to-text) transcribes the spoken command when it detects the end of voice activity
    YOLO (object detection), fine-tuned on MTGA screenshots, finds cards and buttons on screen and returns class labels and bounding boxes
    OCR (text recognition) reads the card names and text out of those bounding boxes
    LLM (language model) matches the transcribed command against the actual on-screen cards and emits tool calls that drive the cursor, click, and play the right card

Each piece does something the others can't. The LLM alone can't see the screen. YOLO finds where things are but can't read them. OCR reads text but doesn't know which thing the user asked for. STT hears the command but can't act on it. The combination is what makes the whole thing work.

    With your partner: Pick one of the AI-enabled apps you use regularly (a search engine, a coding assistant, a photo app, voice assistant, etc.). Try to break it into components. For each component, what AI is probably running, and what could go wrong with that piece in isolation?

Other component combinations

Lots of stacks work. A few to spark ideas:

    STT + LLM + Vector/Embedding DB for a voice-driven research assistant or note-taking tool that searches your own content semantically.
    YOLO + LLM + TTS (text-to-speech) for an app that watches a live video feed, describes what's happening, and speaks it back.
    Custom NN + Traditional ML model + Hosted API for something domain-specific where you train one piece, use a classical model for structured data, and call out to an LLM or vision API for the rest.
    Whisper + LLM + Diffusion model for turning a spoken description into a generated image with iterative voice refinement.

Anything in this neighborhood of complexity works. If your team has a different pitch, bring it up at the review and we'll talk through it.
AI infrastructure

Running multiple ML components in one app gets expensive fast if you're not careful. A few options that keep costs down or eliminate them:

    Groq Cloud offers fast free inference for a variety of model types up to rate limits. Great for LLMs when you want low latency without a credit card.
    OpenRouter has a free tier with access to a range of models, plus paid tiers for anything heavier.
    Azure has a huge catalog of AI services with significant free credits for students. Worth using for vision, speech, language, and search components specifically.
    Local inference for vision models (YOLO, OCR) is often free and fast enough on your laptop. No API calls needed.

This video walks through using an Azure API. It's a little dated, but the process still works similarly today and should give you a sense of what calling these services looks like.

Pick infrastructure per component. Mix providers wherever it makes sense, one for vision, another for the LLM, local for the rest.
Form your teams

Get into groups of 2 to 4 people. Once you have a team, start brainstorming. Aim for ideas where:

    Each person on the team can clearly own a piece of the work
    The components have a real reason to be combined and produce something that none of them could on their own
    You'd actually use the thing if it existed