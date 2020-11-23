# Livreiro

PhD Work for Collective Intelligence Class (2020).

## Application

The application is intended for mobile devices as they are already widely used and increasingly accessible. The application allows access to a crowdsourcing system from the competition by implementing the following features:

- users record and send their interpretations of a fragment of text to apply to be an actor in a given audiobook;
- users vote for other users who have applied and submitted an audio sample to the system.

### Library ([home.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/home/home.page.ts))

<p align="center">
    <img src="/imgs/library.png" width="300">
</p>

### Player ([player.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/player/player.page.ts))

<p align="center">
    <img src="/imgs/player.png" width="300">
</p>

This figure shows the interface with the informations at the top, where a user can vote for the person they want to be the voice for an specific character/storyteller.

### Recorder ([recorder.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/recorder/recorder.page.ts))

<p align="center">
    <img src="/imgs/recorder.png" width="300">
</p>


The figure shows the audio recording interface for a user to apply for performance. In this image, the title of the work, the character to be recorded, the written text to be interpreted and the play, rec and pause control buttons are displayed.

When a user applies to participate in the casting of an audiobook work, the recording must be made through the figure's interface and, soon after, the end of phrase markings must be made, that is, the segmentation of the audio. Thus, from the audio recorded together with the marking of the intervals between one phrase and another, it is possible to obtain the separation between the phrases with greater accuracy when compared to algorithms that perform this same function. Consequently, the resulting data can be used for the development of TTS applications.