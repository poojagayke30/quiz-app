// Variables for category selection
const categorySelection = document.getElementById('category-selection');
const calendarBtn = document.getElementById('calendar-btn');
const ageBtn = document.getElementById('age-btn');
const clockBtn = document.getElementById('clock-btn');
const numberSeriesBtn = document.getElementById('number-series-btn');

// Category selection event listeners
calendarBtn.addEventListener('click', () => selectCategory('calendar'));
ageBtn.addEventListener('click', () => selectCategory('age'));
clockBtn.addEventListener('click', () => selectCategory('clock'));
numberSeriesBtn.addEventListener('click', () => selectCategory('numberSeries')); // Correct button for 'Number' category

// Get user name and Enter button
const nameInput = document.getElementById('name');
const enterBtn = document.getElementById('enter-btn');

// Quiz data structure and questions
const Question = function(question, options, answer) {
  this.question = question;
  this.options = options;
  this.answer = answer;
};

const Categories = function() {
  this.calendar = [];
  this.age = [];
  this.clock = [];
  this.numberSeries = [];
};

// Initialize quiz data
const questions = new Categories();

// Define quiz questions for each category
questions.calendar = [
  new Question("What was the day on 15th August 1947?", ["Friday", "Saturday", "Sunday", "Thursday"], "Friday"),
  new Question("Today is Monday. After 61 days, it will be:", ["Tuesday", "Monday", "Sunday", "Saturday"], "Saturday"),
  new Question("It was Sunday on Jan 1, 2006. What was the day of the week Jan 1, 2010?", ["Monday", "Friday", "Sunday", "Tuesday"], "Friday"),
  new Question("The last day of a century cannot be", ["Monday", "Wednesday", "Tuesday", "Friday"], "Tuesday")
];

questions.age = [
  new Question("What is Aman's present age, if after 20 years his age will be 10 times his age 10 years back?", ["6.2 years", "7.7 years", "13.3 years", "10 years"], "10 years"),
  new Question("Nisha is 15 years elder to Romi. If 5 years ago, Nisha was 3 times as old as Romi, then find Nisha’s present age.", ["32.5 years", "27.5 years", "25 years", "24.9 years"], "25 years"),
  new Question("One year ago, the ratio of Honey and Piyush's ages was 2:3. After five years, this ratio becomes 4:5. How old is Piyush now?", ["5 years", "25 years", "10 years", "15 years"], "15 years"),
  new Question("Ten years ago, the age of mother was three times the age of her son. After ten years, mother’s age will be twice that of his son. Find the ratio of their present ages.", ["11:7", "9:5", "7:4", "7:3"], "7:3")
];

questions.clock = [
  new Question("An accurate clock shows 8 o'clock in the morning. Through how many degrees will the hour hand rotate when the clock shows 2 o'clock in the afternoon?", ["154°", "170°", "160°", "180°"], "180°"),
  new Question("A clock is started at noon. By 10 minutes past 5, the hour hand has turned through", ["145°", "152°", "155°", "140°"], "155°"),
  new Question("At what time between 5:30 and 6 will the hands of a clock be at right angles?", ["44(7/11) minutes past 5", "43 minutes past 5", "43(7/11) minutes past 5", "44 minutes past 5"], "43(7/11) minutes past 5"),
  new Question("The reflex angle between the hands of a clock at 10:25 is:", ["180°", "192(1/2)°", "195°", "192(1/2)°"], "192(1/2)°")
];

questions.numberSeries = [
  new Question("Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", ["(1/3)", "(1/8)", "(2/8)", "(1/16)"], "(1/8)"),
  new Question("Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?", ["7", "10", "12", "13"], "13"),
  new Question("Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", ["20", "22", "23", "26"], "20"),
  new Question("Look at this series: 22, 21, 23, 22, 24, 23, ... What number should come next?", ["22", "24", "25", "26"], "24")
];

let userName = '';
let currentCategory = 'age'; // Default category (can be changed dynamically)
let currentQuestionIndex = 0;
let score = 0;
let totalTimeTaken = 0;
let timerInterval;
let timerStarted = false;

// Add event listener for the Enter button to validate user input and display category selection
enterBtn.addEventListener('click', () => {
  // Validate user name
  if (nameInput.value.trim() === '') {
    alert('Please enter your name');
    return;
  }

  // Get user's name from input field
  userName = nameInput.value.trim();

  // Hide home page and show category selection
  document.getElementById('home-page').style.display = 'none';
  categorySelection.style.display = 'block'; // Show category buttons
});

// Function to select category and start quiz
function selectCategory(category) {
  // Hide category selection and show quiz page
  categorySelection.style.display = 'none';
  document.getElementById('quiz-page').style.display = 'block'; // Show the quiz page

  // Set the current category to the selected one
  currentCategory = category;

  // Reset question index, score, and timer
  currentQuestionIndex = 0;
  score = 0;
  totalTimeTaken = 0;
  timerStarted = false; // Reset timer state

  // Initialize quiz for the selected category
  initQuiz();
}

// Function to initialize quiz for selected category
function initQuiz() {
  // Ensure questions exist for the selected category
  if (questions[currentCategory] && questions[currentCategory].length > 0) {
    // Display the first question of the selected category
    displayQuizQuestion(questions[currentCategory][currentQuestionIndex]);
  } else {
    alert("No questions available for this category.");
  }
}

// Function to display quiz question
function displayQuizQuestion(question) {
  // Get elements for displaying the question and options
  const questionNumber = document.getElementById('question-number');
  const questionText = document.getElementById('question-text');
  const options = document.getElementById('options');
  
  // Update the question number and text
  questionNumber.textContent = `Question ${currentQuestionIndex + 1}`;
  questionText.textContent = question.question;
  
  // Clear any previous options
  options.innerHTML = '';
  
  // Add the options as buttons
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.textContent = option;
    optionBtn.dataset.index = index.toString();
    optionBtn.addEventListener('click', (event) => checkAnswer(event, question));
    options.appendChild(optionBtn);
  });
}

// Check the answer and move to next question
function checkAnswer(event, question) {
  // Start the timer only once
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  // Get selected answer
  const selectedAnswer = event.target.textContent;

  // Check if selected answer is correct
  if (selectedAnswer === question.answer) {
    score++;
  }

  currentQuestionIndex++;

  // If there are more questions
  if (currentQuestionIndex < questions[currentCategory].length) {
    displayQuizQuestion(questions[currentCategory][currentQuestionIndex]);
  } else {
    displayResult();
  }
}

// Start the timer only when the first question is answered
function startTimer() {
  timerInterval = setInterval(() => {
    totalTimeTaken++;
    document.getElementById('time').textContent = formatTime(totalTimeTaken);
  }, 1000);
}

// Format time into minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function displayResult() {
  // Stop the timer
  clearInterval(timerInterval);

  // Calculate quiz metrics
  const totalQuestions = questions[currentCategory].length;
  const correctAnswers = score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  // Hide quiz section
  document.getElementById('quiz-page').style.display = 'none';

  // Show result section
  document.getElementById('result-page').style.display = 'block';

  // Display result details, including the participant's name
  document.getElementById('result-name').textContent = `Name: ${userName}`; // This should display the name
  document.getElementById('result-time').textContent = `Total Time Taken: ${formatTime(totalTimeTaken)}`;
  document.getElementById('result-questions').textContent = `Total Questions Attempted: ${totalQuestions}`;
  document.getElementById('result-correct').textContent = `Correct Answers: ${correctAnswers}`;
  document.getElementById('result-wrong').textContent = `Wrong Answers: ${wrongAnswers}`;
  document.getElementById('result-score').textContent = `Score: ${percentageScore}%`;
}

  // Event listener for Start Again button
  document.getElementById('start-again-btn').addEventListener('click', () => {
    // Reset and restart quiz
    categorySelection.style.display = 'block';
    document.getElementById('result-page').style.display = 'none';
  });

  // Event listener for Go to Home button
  document.getElementById('go-home-btn').addEventListener('click', () => {
    // Go to home page
    document.getElementById('result-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
  });
