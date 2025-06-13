document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Calculator mode switching
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calculators = {
        standard: document.getElementById('calculator'),
        scientific: document.getElementById('scientific-calculator'),
        currency: document.getElementById('currency-calculator'),
        quiz: document.getElementById('quiz-calculator')
    };

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected calculator
            Object.values(calculators).forEach(calc => calc.classList.add('hidden'));
            calculators[mode].classList.remove('hidden');
        });
    });

    // Standard Calculator
    class Calculator {
        constructor(previousOperandElement, currentOperandElement) {
            this.previousOperandElement = previousOperandElement;
            this.currentOperandElement = currentOperandElement;
            this.clear();
        }

        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
        }

        delete() {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
            if (this.currentOperand === '') {
                this.currentOperand = '0';
            }
        }

        appendNumber(number) {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }

        chooseOperation(operation) {
            if (this.currentOperand === '') return;
            if (this.previousOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev)) return;

            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '/':
                    computation = prev / current;
                    break;
                default:
                    return;
            }

            this.currentOperand = computation;
            this.operation = undefined;
            this.previousOperand = '';
        }

        updateDisplay() {
            this.currentOperandElement.innerText = this.currentOperand;
            if (this.operation != null) {
                this.previousOperandElement.innerText = 
                    `${this.previousOperand} ${this.operation}`;
            } else {
                this.previousOperandElement.innerText = '';
            }
        }
    }

    const numberButtons = document.querySelectorAll('.number');
    const operationButtons = document.querySelectorAll('.operation');
    const equalsButton = document.getElementById('equals');
    const deleteButton = document.getElementById('delete');
    const clearButton = document.getElementById('clear');

    const calculator = new Calculator(
        document.getElementById('previous-operand'),
        document.getElementById('current-operand')
    );

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });

    // Scientific Calculator
    class ScientificCalculator extends Calculator {
        constructor(previousOperandElement, currentOperandElement) {
            super(previousOperandElement, currentOperandElement);
        }

        scientificOperation(operation) {
            let computation;
            const current = parseFloat(this.currentOperand);
            if (isNaN(current)) return;

            switch (operation) {
                case 'sin':
                    computation = Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    computation = Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    computation = Math.tan(current * Math.PI / 180);
                    break;
                case '√':
                    computation = Math.sqrt(current);
                    break;
                case 'x^y':
                    this.operation = '^';
                    this.previousOperand = this.currentOperand;
                    this.currentOperand = '';
                    return;
                case 'x!':
                    computation = this.factorial(current);
                    break;
                case 'log':
                    computation = Math.log10(current);
                    break;
                case 'ln':
                    computation = Math.log(current);
                    break;
                case 'π':
                    this.currentOperand = Math.PI.toString();
                    return;
                case 'e':
                    this.currentOperand = Math.E.toString();
                    return;
                case '%':
                    computation = current / 100;
                    break;
                case '( )':
                    if (this.currentOperand.includes('(')) {
                        this.currentOperand += ')';
                    } else {
                        this.currentOperand = '(' + this.currentOperand;
                    }
                    return;
                default:
                    return;
            }

            this.currentOperand = computation;
            this.updateDisplay();
        }

        factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        compute() {
            if (this.operation === '^') {
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev)) return;
                this.currentOperand = Math.pow(prev, current);
                this.operation = undefined;
                this.previousOperand = '';
            } else {
                super.compute();
            }
        }
    }

    const sciNumberButtons = document.querySelectorAll('.sci-number');
    const sciOperationButtons = document.querySelectorAll('.sci-operation');
    const sciFuncButtons = document.querySelectorAll('.sci-func');
    const sciEqualsButton = document.getElementById('sci-equals');
    const sciDeleteButton = document.getElementById('sci-delete');
    const sciClearButton = document.getElementById('sci-clear');

    const sciCalculator = new ScientificCalculator(
        document.getElementById('sci-previous-operand'),
        document.getElementById('sci-current-operand')
    );

    sciNumberButtons.forEach(button => {
        button.addEventListener('click', () => {
            sciCalculator.appendNumber(button.innerText);
            sciCalculator.updateDisplay();
        });
    });

    sciOperationButtons.forEach(button => {
        button.addEventListener('click', () => {
            sciCalculator.chooseOperation(button.innerText);
            sciCalculator.updateDisplay();
        });
    });

    sciFuncButtons.forEach(button => {
        button.addEventListener('click', () => {
            sciCalculator.scientificOperation(button.innerText);
            sciCalculator.updateDisplay();
        });
    });

    sciEqualsButton.addEventListener('click', () => {
        sciCalculator.compute();
        sciCalculator.updateDisplay();
    });

    sciClearButton.addEventListener('click', () => {
        sciCalculator.clear();
        sciCalculator.updateDisplay();
    });

    sciDeleteButton.addEventListener('click', () => {
        sciCalculator.delete();
        sciCalculator.updateDisplay();
    });

    // Currency Converter
    const currencyDisplay = document.getElementById('currency-display');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const currencyResult = document.getElementById('currency-result');
    const currNumberButtons = document.querySelectorAll('.currency-mode .number');
    const currClearButton = document.getElementById('curr-clear');
    const currDeleteButton = document.getElementById('curr-delete');
    const currConvertButton = document.getElementById('curr-convert');
    const currSwapButton = document.getElementById('curr-swap');

    let currencyValue = '0';

    currNumberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currencyValue === '0' && button.innerText !== '.') {
                currencyValue = button.innerText;
            } else {
                currencyValue += button.innerText;
            }
            currencyDisplay.innerText = currencyValue;
        });
    });

    currClearButton.addEventListener('click', () => {
        currencyValue = '0';
        currencyDisplay.innerText = currencyValue;
        currencyResult.innerText = '';
    });

    currDeleteButton.addEventListener('click', () => {
        currencyValue = currencyValue.slice(0, -1);
        if (currencyValue === '') {
            currencyValue = '0';
        }
        currencyDisplay.innerText = currencyValue;
    });

    currConvertButton.addEventListener('click', async () => {
        if (currencyValue === '0') return;
        
        const amount = parseFloat(currencyValue);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        try {
            const data = await (await fetch(https) //api.exchangerate-api.com/v4/latest/${from});
            ).json();
            const rate = data.rates[to];
            const result = (amount * rate).toFixed(2);
            
            currencyResult.innerHTML = `
                ${amount} ${from} = <strong>${result} ${to}</strong><br>
                <small>1 ${from} = ${rate.toFixed(6)} ${to}</small>
            `;
        } catch (error) {
            currencyResult.innerText = 'Error fetching exchange rates. Please try again later.';
            console.error('Currency conversion error:', error);
            
            // Fallback rates if API fails
            const fallbackRates = {
                USD: { EUR: 0.85, GBP: 0.73, JPY: 110.15, CAD: 1.25, AUD: 1.30, CNY: 6.45, INR: 74.50 },
                EUR: { USD: 1.18, GBP: 0.86, JPY: 129.54, CAD: 1.47, AUD: 1.53, CNY: 7.59, INR: 87.65 },
                GBP: { USD: 1.37, EUR: 1.16, JPY: 150.23, CAD: 1.71, AUD: 1.78, CNY: 8.82, INR: 101.85 },
                JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0067, CAD: 0.011, AUD: 0.012, CNY: 0.059, INR: 0.68 },
                CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 90.91, AUD: 1.04, CNY: 5.16, INR: 59.60 },
                AUD: { USD: 0.77, EUR: 0.65, GBP: 0.56, JPY: 83.33, CAD: 0.96, CNY: 4.96, INR: 57.30 },
                CNY: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 16.95, CAD: 0.19, AUD: 0.20, INR: 11.55 },
                INR: { USD: 0.013, EUR: 0.011, GBP: 0.0098, JPY: 1.47, CAD: 0.017, AUD: 0.017, CNY: 0.087 }
            };
            
            if (fallbackRates[from] && fallbackRates[from][to]) {
                const rate = fallbackRates[from][to];
                const result = (amount * rate).toFixed(2);
                
                currencyResult.innerHTML = `
                    ${amount} ${from} = <strong>${result} ${to}</strong> (using fallback rates)<br>
                    <small>1 ${from} = ${rate.toFixed(6)} ${to}</small>
                `;
            }
        }
    });

    currSwapButton.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
    });

    // Quiz Mode
    const quizQuestion = document.getElementById('quiz-question');
    const optionButtons = [
        document.getElementById('option1'),
        document.getElementById('option2'),
        document.getElementById('option3'),
        document.getElementById('option4')
    ];
    const quizScore = document.getElementById('quiz-score');
    const quizTimer = document.getElementById('quiz-timer');
    const startQuizButton = document.getElementById('start-quiz');
    const nextQuestionButton = document.getElementById('next-question');
    const quizResult = document.getElementById('quiz-result');

    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 30;
    let quizActive = false;

    const quizQuestions = [
        {
            question: "What is 15 + 27?",
            options: ["32", "42", "52", "62"],
            answer: 1
        },
        {
            question: "What is 8 × 7?",
            options: ["48", "56", "64", "72"],
            answer: 1
        },
        {
            question: "What is 144 ÷ 12?",
            options: ["10", "11", "12", "13"],
            answer: 2
        },
        {
            question: "What is 5² + 3³?",
            options: ["34", "42", "52", "62"],
            answer: 2
        },
        {
            question: "What is the square root of 169?",
            options: ["11", "12", "13", "14"],
            answer: 2
        },
        {
            question: "What is 3/4 of 80?",
            options: ["40", "50", "60", "70"],
            answer: 2
        },
        {
            question: "What is 25% of 200?",
            options: ["25", "50", "75", "100"],
            answer: 1
        },
        {
            question: "What is 17 - 9 + 5?",
            options: ["11", "12", "13", "14"],
            answer: 2
        },
        {
            question: "What is 1/2 + 1/4?",
            options: ["1/6", "2/6", "3/4", "1/3"],
            answer: 2
        },
        {
            question: "What is the next prime number after 7?",
            options: ["8", "9", "10", "11"],
            answer: 3
        }
    ];

    startQuizButton.addEventListener('click', startQuiz);
    nextQuestionButton.addEventListener('click', nextQuestion);

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        timeLeft = 30;
        quizActive = true;
        
        startQuizButton.classList.add('hidden');
        nextQuestionButton.classList.add('hidden');
        quizResult.classList.add('hidden');
        
        updateScore();
        startTimer();
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            endQuiz();
            return;
        }
        
        const question = quizQuestions[currentQuestion];
        quizQuestion.textContent = question.question;
        
        optionButtons.forEach((button, index) => {
            button.textContent = question.options[index];
            button.classList.remove('correct', 'wrong');
            button.disabled = false;
            button.addEventListener('click', () => checkAnswer(index));
        });
    }

    function checkAnswer(selectedIndex) {
        if (!quizActive) return;
        
        const question = quizQuestions[currentQuestion];
        optionButtons.forEach(button => button.disabled = true);
        
        if (selectedIndex === question.answer) {
            optionButtons[selectedIndex].classList.add('correct');
            score++;
            updateScore();
        } else {
            optionButtons[selectedIndex].classList.add('wrong');
            optionButtons[question.answer].classList.add('correct');
        }
        
        nextQuestionButton.classList.remove('hidden');
    }

    function nextQuestion() {
        currentQuestion++;
        nextQuestionButton.classList.add('hidden');
        showQuestion();
    }

    function endQuiz() {
        quizActive = false;
        clearInterval(timer);
        
        const percentage = Math.round((score / quizQuestions.length) * 100);
        let message;
        
        if (percentage >= 90) message = `Excellent! You scored ${score}/${quizQuestions.length} (${percentage}%)`;
        else if (percentage >= 70) message = `Good job! You scored ${score}/${quizQuestions.length} (${percentage}%)`;
        else if (percentage >= 50) message = `Not bad! You scored ${score}/${quizQuestions.length} (${percentage}%)`;
        else message = `Keep practicing! You scored ${score}/${quizQuestions.length} (${percentage}%)`;
        
        quizResult.textContent = message;
        quizResult.classList.remove('hidden');
        startQuizButton.classList.remove('hidden');
        quizQuestion.textContent = "Click 'Start Quiz' to play again!";
        
        optionButtons.forEach(button => {
            button.textContent = '';
            button.classList.remove('correct', 'wrong');
        });
    }

    function updateScore() {
        quizScore.textContent = score;
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 30;
        quizTimer.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            quizTimer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }
});