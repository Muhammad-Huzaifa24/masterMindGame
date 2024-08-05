document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const checkButton = document.getElementById("checkButton");
  const newGame = document.querySelector("#new-game");

  // Modal elements
  const modal = document.getElementById("modal");
  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const winModal = document.getElementById("winModal");
  const playAgainButton = document.getElementById("playAgainButton");
  const returnHomeButton = document.getElementById("returnHomeButton");
  const alertModal = document.getElementById("alertModal");
  const alertMessage = document.getElementById("alertMessage");
  const alertOkButton = document.getElementById("alertOkButton");

  let currentRow = 0;
  const totalRows = 10;
  let allowDuplicates = false;
  let code = [];
  let selectedColor = "";
  let codeGenerated = false; // Track if code has been generated

  // Show modal function
  function showModal(modalElement) {
    modalElement.style.display = "flex";
    // Hide other modals
    if (modalElement !== modal) modal.style.display = "none";
    if (modalElement !== winModal) winModal.style.display = "none";
    if (modalElement !== alertModal) alertModal.style.display = "none";
  }

  // Hide modal function
  function hideModals() {
    modal.style.display = "none";
    winModal.style.display = "none";
    alertModal.style.display = "none";
  }

  // Initialize modal
  setTimeout(() => {
    showModal(modal);
  }, 1000);

  function generateRandomCode() {
    const colors = [
      "red",
      "green",
      "blue",
      "orange",
      "cyan",
      "purple",
      "brown",
      "white",
    ];
    let code = [];
    let availableColors = [...colors];

    for (let i = 0; i < 4; i++) {
      if (allowDuplicates) {
        code.push(
          availableColors[Math.floor(Math.random() * availableColors.length)]
        );
      } else {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        code.push(availableColors[randomIndex]);
        availableColors.splice(randomIndex, 1); // Remove used color
      }
    }

    if (codeGenerated) {
      console.log("Code Maker's Colors: ", code);
    }

    return code;
  }

  function createRows() {
    for (let i = 0; i < totalRows; i++) {
      let subContainer = document.createElement("div");
      subContainer.classList.add("sub-container");

      let leftDiv = document.createElement("div");
      leftDiv.setAttribute("class", "left");

      for (let j = 0; j < 4; j++) {
        let circle = document.createElement("div");
        circle.classList.add("circle-l");
        if (i !== currentRow) {
          circle.classList.add("disabled");
        } else {
          circle.classList.add("active");
        }
        leftDiv.append(circle);
      }

      let rightDiv = document.createElement("div");
      rightDiv.setAttribute("class", "right");

      for (let j = 0; j < 4; j++) {
        let circle = document.createElement("div");
        circle.classList.add("circle-r");
        rightDiv.append(circle);
      }

      subContainer.append(leftDiv);
      subContainer.append(rightDiv);
      container.append(subContainer);
    }
  }

  function setAnswer() {
    const answerDiv = document.querySelector(".answer");
    answerDiv.innerHTML = ""; // Clear existing circles
    for (let i = 0; i < 4; i++) {
      let circle = document.createElement("div");
      circle.classList.add("circle-l");
      circle.style.border = "1px solid white";
      circle.innerText = "?";
      answerDiv.append(circle);
    }
  }
  setAnswer();

  function updateRowAccess() {
    const rows = document.querySelectorAll(".left .circle-l");
    rows.forEach((circle, index) => {
      if (Math.floor(index / 4) === currentRow) {
        circle.classList.remove("disabled");
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
        circle.classList.add("disabled");
      }
    });
  }

  function getCurrentGuess() {
    const currentRowCircles =
      document.querySelectorAll(".left")[currentRow].children;
    let guess = [];
    for (let circle of currentRowCircles) {
      guess.push(circle.style.backgroundColor || null);
    }
    return guess;
  }

  function checkGuess(guess) {
    let feedback = {
      correctPosition: 0,
      correctColor: 0,
      incorrectColor: 0,
    };
    let tempCode = [...code];
    let tempGuess = [...guess];

    tempGuess.forEach((color, index) => {
      if (color === tempCode[index]) {
        feedback.correctPosition++;
        tempCode[index] = null;
        tempGuess[index] = null;
      }
    });

    tempGuess.forEach((color, index) => {
      if (color && tempCode.includes(color)) {
        feedback.correctColor++;
        tempCode[tempCode.indexOf(color)] = null;
      }
    });

    feedback.incorrectColor =
      4 - (feedback.correctPosition + feedback.correctColor);

    return feedback;
  }

  function displayFeedback(feedback) {
    const feedbackCircles =
      document.querySelectorAll(".right")[currentRow].children;
    for (let i = 0; i < feedback.correctPosition; i++) {
      feedbackCircles[i].style.backgroundColor = "red";
    }
    for (
      let i = feedback.correctPosition;
      i < feedback.correctPosition + feedback.correctColor;
      i++
    ) {
      feedbackCircles[i].style.backgroundColor = "white";
    }
    for (let i = feedback.correctPosition + feedback.correctColor; i < 4; i++) {
      feedbackCircles[i].style.backgroundColor = "black";
    }
  }

  function showAnswer() {
    const answerDiv = document.querySelector(".answer");
    answerDiv.innerHTML = ""; // Clear existing circles
    for (let i = 0; i < 4; i++) {
      let circle = document.createElement("div");
      circle.classList.add("circle-l");
      circle.style.backgroundColor = code[i];
      answerDiv.append(circle);
    }
  }

  function showWinModal() {
    resetCursor();
    showModal(winModal);
  }

  function showAlert(message) {
    alertMessage.textContent = message;
    showModal(alertModal);
  }

  function resetCursor() {
    selectedColor = ""; // Clear selected color
    document.body.style.cursor = "auto"; // Reset cursor to default
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      resetCursor();
    }
  });

  createRows();

  // Generate code initially
  code = generateRandomCode();
  codeGenerated = true;

  const colorCircles = document.querySelectorAll(".colors");
  colorCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      selectedColor = circle.getAttribute("data-color");
      document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" style="fill: ${selectedColor};"><circle cx="20" cy="20" r="20" /></svg>'), auto`;
    });
  });

  container.addEventListener("mousedown", (event) => {
    const target = event.target;
    if (
      target.classList.contains("circle-l") &&
      !target.classList.contains("disabled")
    ) {
      if (selectedColor) {
        const currentRowCircles =
          document.querySelectorAll(".left")[currentRow].children;
        const existingColors = Array.from(currentRowCircles)
          .map((circle) => circle.style.backgroundColor)
          .filter((color) => color); // Filter out empty colors

        const colorCount = existingColors.filter(
          (color) => color === selectedColor
        ).length;

        if (!allowDuplicates && existingColors.includes(selectedColor)) {
          showAlert(
            "You cannot use the same color more than once in a single row."
          );
          return;
        } else if (allowDuplicates && colorCount >= 2) {
          showAlert(
            "You cannot use the same color more than twice in a single row."
          );
          return;
        }
        target.style.backgroundColor = selectedColor;
        resetCursor();
      }
    } else if (target.classList.contains("disabled")) {
      showAlert("You cannot select a circle in a non-active row.");
    }
  });

  checkButton.addEventListener("click", () => {
    const guess = getCurrentGuess();
    if (guess.includes(null) || guess.includes("")) {
      showAlert("Please fill all the circles in the row.");
      return;
    }

    const feedback = checkGuess(guess);
    displayFeedback(feedback);

    if (feedback.correctPosition === 4) {
      showAnswer(); // Display the code maker's colors
      showWinModal(); // Show the win modal
    } else if (currentRow < totalRows - 1) {
      currentRow++;
      updateRowAccess();
    } else {
      showAlert("Game over! You've used all attempts.");
      showAnswer(); // Display the code maker's colors
    }
  });

  // Modal button event listeners

  // Generate code with duplicates allowed

  yesButton.addEventListener("click", () => {
    allowDuplicates = true;
    hideModals();
    code = generateRandomCode();
    codeGenerated = true;
  });

  // Generate code with duplicates not allowed

  noButton.addEventListener("click", () => {
    allowDuplicates = false;
    hideModals();
    code = generateRandomCode();
    codeGenerated = true;
  });

  // Refresh the game

  playAgainButton.addEventListener("click", () => {
    location.reload();
  });

  // Redirect to welcome page

  returnHomeButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Start new game

  newGame.addEventListener("click", function () {
    location.reload();
  });

  // Hide the alert modal when OK is clicked

  alertOkButton.addEventListener("click", () => {
    hideModals();
  });
  updateRowAccess();
});
