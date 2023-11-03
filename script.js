let currentQuestionIndex = 0;
let score = 0;
let attemptedQuestions = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let totalQuizTime = 0;
let remainingTime = 20;
let remainingTimeToQuestion = 20;

const questionElement = document.querySelector(".question");
const optionsElement = document.querySelector(".options");
const timerElement = document.querySelector(".timer");
const progressContainer = document.querySelector(".progress-container");
const questionContainer = document.querySelector(".question-container");
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const startQuizButton = document.querySelector(".start-quiz-button");
const resultContainer = document.querySelector(".result-container");
const scoreElement = document.querySelector(".score");
const attemptedQuestionsElement = document.querySelector(".attempted-questions");
const correctAnswersElement = document.querySelector(".correct-answers");
const incorrectAnswersElement = document.querySelector(".incorrect-answers");
const timeTakenElement = document.querySelector(".time-taken");
const resetButton = document.querySelector(".reset-button");

let timerInterval;
let progressBarPercentage = 0;

let quizData;

function initializeQuiz() {
  startQuizButton.addEventListener("click", () => {
    startQuizButton.style.display = "none";
    progressContainer.style.display = "block";
    questionContainer.style.display = "block";

    shuffleArray(quizData);
    displayQuestion(quizData[currentQuestionIndex]);
  });
}

// Load the quiz data from the JSON file.
fetch("quizQuestions.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = data;
    initializeQuiz(); // Call the initialization function once the data is loaded.
  })
  .catch((error) => {
    console.error("Failed to load quiz data: " + error);
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion(question) {
  questionElement.textContent = `Ques.${currentQuestionIndex + 1}: ${question.question}`;
  optionsElement.innerHTML = "";
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

  shuffleArray(question.options);

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option));
    optionsElement.appendChild(button);
  });

  startTimer(20, () => checkAnswer(null));
  updateProgressBar();
}

function updateProgressBar() {
  progressBar.style.width = progressBarPercentage + "%";
}

function startTimer(seconds, callback) {
  remainingTimeToQuestion = seconds;
  timerInterval = setInterval(() => {
    if (remainingTimeToQuestion <= 0) {
      clearInterval(timerInterval);
      if (callback) callback();
    }
    if (timerElement) {
      timerElement.textContent = remainingTimeToQuestion + " seconds";
    }

    remainingTimeToQuestion--;
    totalQuizTime++;
    timeTakenElement.textContent = totalQuizTime;
  }, 1000);
}

function checkAnswer(selectedOption) {
  clearInterval(timerInterval);
  const currentQuestion = quizData[currentQuestionIndex];
  progressBarPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
  attemptedQuestions++;

  if (selectedOption === currentQuestion.answer) {
    score++;
    correctAnswers++;
  } else {
    incorrectAnswers++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    displayQuestion(quizData[currentQuestionIndex]);
  } else {
    questionContainer.style.display = "none";
    progressBarPercentage = 100; // Set progress to 100% after the last question
    showResult();
  }

  updateProgressBar();
}

function showResult() {
  resultContainer.style.display = "block";
  scoreElement.textContent = `${Math.round((score / quizData.length) * 100)}%`;
  attemptedQuestionsElement.textContent = attemptedQuestions;
  correctAnswersElement.textContent = correctAnswers;
  incorrectAnswersElement.textContent = incorrectAnswers;
  resetButton.addEventListener("click", () => {
    resultContainer.style.display = "none";
    resetQuiz();
  });
}

function resetQuiz() {
  clearInterval(timerInterval);
  progressContainer.style.display = "none";
  questionContainer.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  attemptedQuestions = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  totalQuizTime = 0;
  progressBarPercentage = 0;
  updateProgressBar();
  startQuizButton.style.display = "block";
  questionElement.textContent = "";
  optionsElement.innerHTML = "";
  progressText.textContent = "Question 0 of 0";
}
