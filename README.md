# CS50 Final Project: Yet Another Knockoff Snake

## Project Information
### Video Demo:  <URL https://player1304.github.io/cs50_snake/>
### Website: https://player1304.github.io/cs50_snake/
### Description:
TODO

## Goals
### Minimum targets
- [x] Responsive design with touch screen and keyboard support
- [x] Game over/score screen
- [ ] Make it work on both Android and iOS as a webApp
  - TODO iOS debug: seems like the snake wouldn't move on ios, but works on android and pc. Turns out it's very difficult to debug something when you don't have a physical device.


### Additional goals
- [x] Sound effects
- [ ] Better graphics
- [x] Local scoreboard with names
- [ ] NativeApp on Android/iOS

## Description of the Code
### Code structure
```
.
├── README.md (this file)
├── index.html (main page with title, <meta> tag for responsive design, and a <div> for the game)
├── form.html (used for inputing the name of the player)
├── assets
│   ├── ... (images and sounds used in the game)
├── static
│   ├── game.js (game file)
│   ├── style.css (local CSS, containing the background color of the game)
│   ├── phaser.min.js (local Phaser library)
```