let isMuted = false;

export function toggleSound() {
  const soundIcons = document.querySelectorAll(".sound-icon");
  soundIcons.forEach((icon) => icon.classList.toggle("hidden"));

  isMuted = !isMuted;

  // Swap the SVG images
  soundIcon.src = isMuted ? "icons/volume-xmark.svg" : "icons/volume-high.svg";
  soundIcon.alt = isMuted ? "Sound Off" : "Sound On";

  // Mute/unmute Howler.js sounds
  if (typeof Howler !== "undefined") {
    Howler.mute(isMuted);
  }
}

// Create an object to store sound effects
export const sfx = {
  sorting: new Howl({ src: ["sfx/sort.wav"], volume: 0.5 }),
  selling: new Howl({ src: ["sfx/sell.wav"], volume: 0.5 }),
  softClick: new Howl({ src: ["sfx/soft_click.wav"], volume: 0.5 }),
  buying: new Howl({ src: ["sfx/buyitem.wav"], volume: 0.5 }),
  mining: new Howl({ src: ["sfx/mine.wav"], volume: 0.8 }),
  reject: new Howl({ src: ["sfx/reject.wav"], volume: 0.3 }),
  lucky: new Howl({ src: ["sfx/lucky.wav"], volume: 0.5 }),
};

export function playSound(soundName) {
  if (!isMuted && sfx[soundName]) {
    sfx[soundName].play();
  }
}

// Attach it to the global scope
window.toggleSound = toggleSound;
window.playsound = playSound;
