document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const checkButton = document.getElementById("checkButton");

  let currentRow = 0;

  //total rows
  const totalRows = 10;

  // Flag for allowing duplicates
  let allowDuplicates = false;

  // code maker
  let code = [];

  let selectedColor = "";

  // fill the code maker's circle initially
  const answerDiv = document.querySelector(".answer");
  answerDiv.innerHTML = ""; // Clear existing circles
  answerDiv.style.backgroundColor = "grey";
  for (let i = 0; i < 4; i++) {
    let circle = document.createElement("div");
    circle.classList.add("circle-l");
    circle.innerHTML = "?";
    answerDiv.append(circle);
  }

  // Ask user about duplicates at the start
  if (confirm("Do you want to allow duplicate colors in the code?")) {
    allowDuplicates = true;
  }

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

    // create code maker's code
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
    console.log("Code Maker's Colors: ", code);
    return code;
  }

  // Create dynamic rows using DOM manipulation in reverse order
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

  // update rows
  // active row means white border circle
  // disabled row means yellow border
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

  // extract the current code breaker's guess
  function getCurrentGuess() {
    const currentRowCircles =
      document.querySelectorAll(".left")[currentRow].children;
    let guess = [];
    for (let circle of currentRowCircles) {
      guess.push(circle.style.backgroundColor || null);
    }
    return guess;
  }

  // generate feedback on code breaker's guess
  // and fill right divs
  function checkGuess(guess) {
    let feedback = {
      correctPosition: 0,
      correctColor: 0,
      incorrectColor: 0,
    };
    let tempCode = [...code];
    let tempGuess = [...guess];

    // Check for correct positions
    tempGuess.forEach((color, index) => {
      if (color === tempCode[index]) {
        feedback.correctPosition++;
        tempCode[index] = null;
        tempGuess[index] = null;
      }
    });

    // Check for correct colors
    tempGuess.forEach((color, index) => {
      if (color && tempCode.includes(color)) {
        feedback.correctColor++;
        tempCode[tempCode.indexOf(color)] = null;
      }
    });

    // Check for incorrect colors
    feedback.incorrectColor =
      4 - (feedback.correctPosition + feedback.correctColor);

    return feedback;
  }

  // display feedback on left divs
  // based on condition
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

  // fill the answer div with code maker's code
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

  createRows();
  code = generateRandomCode(); // Generates a random code for the game

  const colorCircles = document.querySelectorAll(".colors");
  colorCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      selectedColor = circle.getAttribute("data-color");
      document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewport="0 0 100 100" style="fill: ${selectedColor};"><circle cx="15" cy="15" r="15" /></svg>'), auto`;
    });
  });

  // container.addEventListener("click", (event) => {
  //   const target = event.target;
  //   if (
  //     target.classList.contains("circle-l") &&
  //     !target.classList.contains("disabled")
  //   ) {
  //     if (selectedColor) {
  //       if (!allowDuplicates) {
  //         const currentRowCircles =
  //           document.querySelectorAll(".left")[currentRow].children;
  //         const existingColors = Array.from(currentRowCircles)
  //           .map((circle) => circle.style.backgroundColor)
  //           .filter((color) => color); // Filter out empty colors

  //         if (existingColors.includes(selectedColor)) {
  //           alert(
  //             "You cannot use the same color more than once in a single row."
  //           );
  //           return;
  //         }
  //       }
  //       target.style.backgroundColor = selectedColor;
  //     }
  //   } else if (target.classList.contains("disabled")) {
  //     alert("You cannot select a circle in a non-active row.");
  //   }
  // });

  container.addEventListener("click", (event) => {
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
          alert(
            "You cannot use the same color more than once in a single row."
          );
          return;
        } else if (allowDuplicates && colorCount >= 2) {
          alert(
            "You cannot use the same color more than twice in a single row."
          );
          return;
        }
        target.style.backgroundColor = selectedColor;
      }
    } else if (target.classList.contains("disabled")) {
      alert("You cannot select a circle in a non-active row.");
    }
  });

  checkButton.addEventListener("click", () => {
    const guess = getCurrentGuess();
    if (guess.includes(null) || guess.includes("")) {
      alert("Please fill all the circles in the row.");
      return;
    }

    const feedback = checkGuess(guess);
    displayFeedback(feedback);

    if (feedback.correctPosition === 4) {
      alert("Congratulations! You've cracked the code!");
      showAnswer(); // Display the code maker's colors
      if (confirm("Do you want to play again?")) {
        location.reload(); // Refresh the game
      } else {
        window.location.href = "index.html"; // Redirect to welcome page
      }
    } else if (currentRow < totalRows - 1) {
      currentRow++;
      updateRowAccess();
    } else {
      alert("Game over! You've used all attempts.");
      showAnswer(); // Display the code maker's colors
    }
  });

  updateRowAccess();
});
