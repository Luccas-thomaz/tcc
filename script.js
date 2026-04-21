let score = 0,
  currentQuestion = 0,
  totalQuestions = 5,
  timePerQuestion = 10,
  timer;
let selectedOperations = [],
  questions = [];

// ---------- Navegação ----------
function goBack() {
  document
    .querySelectorAll("#help, #free-mode, #ranking")
    .forEach((el) => el.classList.add("hidden"));
  document.getElementById("menu").classList.remove("hidden");
}

function showHelp() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("help").classList.remove("hidden");
}

function showFreeMode() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("free-mode").classList.remove("hidden");
}

function showRanking() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("ranking").classList.remove("hidden");
  loadRanking();
}

// ---------- Dificuldades ----------
function startSelectedDifficulty() {
  const difficulty = document.getElementById("difficulty").value;
  if (difficulty === "easy") {
    timePerQuestion = 15;
    totalQuestions = 5;
    selectedOperations = ["add", "sub"];
  } else if (difficulty === "medium") {
    timePerQuestion = 10;
    totalQuestions = 10;
    selectedOperations = ["add", "sub", "mul"];
  } else {
    timePerQuestion = 7;
    totalQuestions = 15;
    selectedOperations = ["add", "sub", "mul", "div"];
  }
  startQuiz();
}

// ---------- Modo Livre ----------
function startFreeMode() {
  timePerQuestion = parseInt(document.getElementById("timeInput").value);
  totalQuestions = parseInt(document.getElementById("numQuestionsInput").value);
  selectedOperations = Array.from(
    document.querySelectorAll(".op-check:checked")
  ).map((el) => el.value);
  if (selectedOperations.length === 0)
    selectedOperations = ["add", "sub", "mul", "div"];
  startQuiz();
}

// ---------- Geração de Perguntas ----------
function generateQuestion() {
  let num1, num2, question, answer;
  let op =
    selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
  switch (op) {
    case "add":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case "sub":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      if (num2 > num1) [num1, num2] = [num2, num1];
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case "mul":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      question = `${num1} x ${num2}`;
      answer = num1 * num2;
      break;
    case "div":
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * answer;
      question = `${num1} ÷ ${num2}`;
      break;
  }
  let options = new Set([answer]);
  while (options.size < 4) {
    let fake = answer + (Math.floor(Math.random() * 7) - 3);
    if (fake > 0 && fake !== answer) options.add(fake);
  }
  return {
    question,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    answer,
  };
}

// ---------- Lógica Principal ----------
function startQuiz() {
  score = 0;
  currentQuestion = 0;
  questions = [];
  for (let i = 0; i < totalQuestions; i++) questions.push(generateQuestion());
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("free-mode").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    document.getElementById("question").innerText = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    q.options.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.className = "option";
      button.onclick = () => checkAnswer(option, button);
      optionsDiv.appendChild(button);
    });
    if (timePerQuestion > 0) {
      let timeLeft = timePerQuestion;
      document.getElementById("timer").innerText = "Tempo: " + timeLeft + "s";
      clearInterval(timer);
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "Tempo: " + timeLeft + "s";
        if (timeLeft <= 0) {
          clearInterval(timer);
          showCorrectAnswer();
          Array.from(document.getElementById("options").children).forEach(
            (btn) => (btn.disabled = true)
          );
          setTimeout(() => {
            currentQuestion++;
            loadQuestion();
          }, 800);
        }
      }, 1000);
    } else document.getElementById("timer").innerText = "";
  } else endQuiz();
}

function checkAnswer(selected, button) {
  const q = questions[currentQuestion];
  const soundCorrect = document.getElementById("sound-correct");
  const soundWrong = document.getElementById("sound-wrong");
  if (selected == q.answer) {
    score++;
    button.style.backgroundColor = "#32cd32";
    soundCorrect.currentTime = 0;
    soundCorrect.play();
  } else {
    button.style.backgroundColor = "#ff4c4c";
    soundWrong.currentTime = 0;
    soundWrong.play();
    showCorrectAnswer();
  }
  Array.from(document.getElementById("options").children).forEach(
    (btn) => (btn.disabled = true)
  );
  clearInterval(timer);
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 800);
}

function showCorrectAnswer() {
  const q = questions[currentQuestion];
  Array.from(document.getElementById("options").children).forEach((btn) => {
    if (parseInt(btn.innerText) === q.answer)
      btn.style.backgroundColor = "#32cd32";
  });
}

function endQuiz() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("end").classList.remove("hidden");
  document.getElementById(
    "final-score"
  ).innerText = `Você acertou ${score} de ${totalQuestions} perguntas!`;
}

function saveScore() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("Digite seu nome!");
    return;
  }
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  restart();
}

function loadRanking() {
  const list = document.getElementById("ranking-list");
  list.innerHTML = "";
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.name} - ${player.score} pontos`;
    list.appendChild(li);
  });
  if (ranking.length === 0) list.innerHTML = "<p>Ninguém jogou ainda.</p>";
}

function clearRanking() {
  if (confirm("Tem certeza que deseja limpar todo o ranking?")) {
    localStorage.removeItem("ranking");
    loadRanking();
    alert("Ranking limpo com sucesso!");
  }
}

function restart() {
  document.getElementById("end").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
