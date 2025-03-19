let isFirstPress = true;

function handleKeyPress(event) {
  if (event.code === "Space") {
    if (isFirstPress) {
      Start();
      isFirstPress = false;
    } else {
      location.reload();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeyPress);
});

let startTime = null;
let elapsedSeconds = 0;
let timerRunning = false;

function startTimer() {
  startTime = new Date();
  timerRunning = true;
}

function stopTimer() {
  if (timerRunning) {
    const endTime = new Date();
    elapsedSeconds = Math.floor(endTime - startTime);
    timerRunning = false;
    const element1 = document.getElementById("msg");
    const elementc = document.getElementById("clock");

    element1.innerHTML = `${elapsedSeconds} ms`;
    element1.style.opacity = 1;
    element1.style.position = "absolute";
    element1.style.top = "35%";
    element1.style.left = "50%";
    element1.style.transform = "translate(-50%, -50%)";
    element1.style.fontSize = "70px";
    element1.style.color = "white";
    element1.style.userSelect = "all";

    elementc.style.opacity = 1;

    categorizeSpeed(elapsedSeconds);

    updateHistory(elapsedSeconds);
  }
}

function categorizeSpeed(reactionTime) {
  let category;

  switch (true) {
    case reactionTime < 50:
      category =
        "*Konck *Knock      Hey, it's me Goku i heard you're very strong!";
      break;
    case reactionTime >= 50 && reactionTime < 100:
      category = "WAIT WHAT! HOW!? Are you the flash or something?";
      break;
    case reactionTime >= 100 && reactionTime < 150:
      category = "Stand Proud Human You Are Fast!";
      break;
    case reactionTime >= 150 && reactionTime < 200:
      category = "Not too shabby! You're faster than most people!";
      break;
    case reactionTime >= 200 && reactionTime < 280:
      category = "The average human reaction time is approximately 250ms";
      break;
    case reactionTime >= 280 && reactionTime < 400:
      category = "Kinda slow... but you're not the slowest!";
      break;
    case reactionTime >= 400 && reactionTime < 1000:
      category = "Is your internet lagging? Oh, my bad—this site is offline!";
      break;
    case reactionTime >= 1000 && reactionTime < 2000:
      category =
        "Hello? Did you fall asleep? Even a sloth would've beaten you!";
      break;
    default:
      category = "Did you forget to click, or are you practicing patience?";
      break;
  }
  const element = document.getElementById("cat");
  element.innerHTML = category;
  element.style.opacity = 1;
}
function Start() {
  const element1 = document.getElementById("msg");
  element1.style.opacity = 0;
  const element2 = document.getElementById("desc");
  element2.style.opacity = 0;
  const elementlb = document.getElementById("lb");
  elementlb.style.opacity = 0;
  elementlb.style.animation = "none";
  const elementhist = document.getElementById("hist");
  elementhist.style.opacity = 0;
  elementhist.style.animation = "none";

  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const timer = getRandomInRange(1000, 3000);

  setTimeout(() => {
    const element3 = document.getElementById("body1");
    element3.style.backgroundColor = "hsl(160, 60%, 65%)"; // cool green that won't make you blind

    startTimer();
  }, timer);

  document.addEventListener("click", (event) => {
    if (event.button === 0) {
      if (startTime == null) {
        alert("Nah Uh!");
        location.reload();
      } else {
        stopTimer();
      }
    }
  });
}

function updateHistory(score) {
  const history = JSON.parse(localStorage.getItem("performanceHistory")) || [];
  const top = JSON.parse(localStorage.getItem("TopScores")) || [];

  // Add new score to the beginning
  history.unshift(score);

  if (history.length > 4) {
    history.pop(); // bye old score
  }

  // Save back to local storage
  localStorage.setItem("performanceHistory", JSON.stringify(history));
  UpdateTop(score);
  displayHistory(); // update the display
}

function displayHistory() {
  const historyList = document.getElementById("histlist");
  historyList.innerHTML = ""; // clear existing items

  const history = JSON.parse(localStorage.getItem("performanceHistory")) || [];

  history.forEach((score) => {
    const listItem = document.createElement("li");
    listItem.style.color = score > 280 ? "red" : "green"; // better than if

    const scoreText = `${score} ms`; // create the string with the score and 'ms' text
    const scoreTextNode = document.createTextNode(scoreText); // create a text node from the string
    listItem.appendChild(scoreTextNode); // append the text node to the list item
    historyList.appendChild(listItem); // append the list item to the history list
  });
}

function UpdateTop(score) {
  let topScores = JSON.parse(localStorage.getItem("TopScores")) || [];

  topScores.push(score);
  topScores.sort((a, b) => a - b);

  // unique scores only
  topScores = [...new Set(topScores)];

  if (topScores.length > 3) {
    topScores = topScores.slice(0, 3); // keep first 3 elements
  }

  localStorage.setItem("TopScores", JSON.stringify(topScores));
  displayTopScores();
}

function displayTopScores() {
  const topScores = JSON.parse(localStorage.getItem("TopScores")) || [0, 0, 0];

  document.getElementById("n1").textContent = `#1: ${topScores[0] || 0} ms`;
  document.getElementById("n2").textContent = `#2: ${topScores[1] || 0} ms`;
  document.getElementById("n3").textContent = `#3: ${topScores[2] || 0} ms`;
}

function clearTopScores() {
  localStorage.removeItem("TopScores");
  displayTopScores();
}

document.addEventListener("DOMContentLoaded", () => {
  displayHistory();
  displayTopScores();
});
