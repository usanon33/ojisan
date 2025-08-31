document.addEventListener('DOMContentLoaded', () => {
    const ojisanPhrases = [
        "ヤッホー、まなチャン、元気カナ？オジサンは、下半身が元気だよ（笑）",
        "おっはー！今日も一日、頑張ろうネ！チュッ😘",
        "ゆきチャンから元気もらいたいナ！なんつっ亭☆",
        "愛チャン、最近、返事が、少ないね。オイラ、さびしいよ(^_^;)",
        "オジサンの、お昼ご飯は、かつ丼、だったよ。ユキチャンと、食べたかったナ😅",
        "チュッチュッチュッチュー( ^з^)☆",
        "ひなチャン、週末は、何してるのかな？(^_^;)",
        "オジサンは、一匹狼、だけど、トモチャンに、暖めてもらいたいナ！ナンツッテ（笑）",
        "オジサンの、ランチは、生姜焼きだよはいあーんして😘",
        "マキチャンの、下着の色を、想像しながら、午後も、頑張るね",
        "人、って漢字は、ユキミチャンと、オジサンが、くっついて、できてるんだヨ！",
        "愛してるよ！ナンツッテ(^ε^)-☆"
    ];

    // --- DOM Elements ---
    const textToTypeElement = document.getElementById('text-to-type');
    const inputField = document.getElementById('input-field');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const titleScreen = document.getElementById('title-screen');
    const gameContainer = document.getElementById('game-container');
    const titleImage = document.getElementById('title-image');

    // --- Game State ---
    let score = 0;
    let timeLeft = 60;
    let timerInterval;
    let cleanPhrase = '';
    let availablePhrases = [];

    // --- FINALLY Corrected Hardcoded Regex ---
    const tokenizerRegex = /(\(^_^;\)|\(\^ε\^\)-☆)/g;
    const isKaomojiRegex = /^(\(^_^;\)|\(\^ε\^\)-☆)$/;
    const skippableForCleanRegex = /(\(^_^;\)|\(\^ε\^\)-☆|〜|～|w| |　|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
    const skippableForTestRegex = /^(\(^_^;\)|\(\^ε\^\)-☆|〜|～|w| |　|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])$/u;
    // --- End Corrected Hardcoded Regex ---

    function startGame() {
        score = 0;
        timeLeft = 60;
        availablePhrases = [...ojisanPhrases]; // Reset the pool of available phrases

        scoreElement.textContent = `Score: ${score}`;
        timerElement.textContent = `Time: ${timeLeft}`;
        
        loadNewPhrase();
        startTimer();

        inputField.value = '';
        inputField.disabled = false;
        inputField.focus();
        inputField.addEventListener('input', handleInput);
    }

    function loadNewPhrase() {
        if (availablePhrases.length === 0) {
            availablePhrases = [...ojisanPhrases];
        }

        const phraseIndex = Math.floor(Math.random() * availablePhrases.length);
        const phrase = availablePhrases.splice(phraseIndex, 1)[0];
        
        cleanPhrase = phrase.replace(skippableForCleanRegex, '');

        textToTypeElement.innerHTML = '';
        const parts = phrase.split(tokenizerRegex).filter(p => p && p.length > 0);

        parts.forEach(part => {
            if (isKaomojiRegex.test(part)) {
                const charSpan = document.createElement('span');
                charSpan.innerText = part;
                textToTypeElement.appendChild(charSpan);
            } else {
                Array.from(part).forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = char;
                    textToTypeElement.appendChild(charSpan);
                });
            }
        });

        inputField.value = '';
    }

    function handleInput() {
        const typedText = inputField.value;
        const phraseChars = textToTypeElement.querySelectorAll('span');
        let typedIndex = 0;
        let allCorrectSoFar = true;

        phraseChars.forEach((charSpan) => {
            const originalText = charSpan.innerText;
            
            if (skippableForTestRegex.test(originalText)) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
            } else {
                if (typedIndex < typedText.length) {
                    const typedChar = typedText[typedIndex];
                    if (typedChar === originalText) {
                        charSpan.classList.add('correct');
                        charSpan.classList.remove('incorrect');
                    } else {
                        charSpan.classList.add('incorrect');
                        charSpan.classList.remove('correct');
                        allCorrectSoFar = false;
                    }
                    typedIndex++;
                } else {
                    charSpan.classList.remove('correct', 'incorrect');
                    allCorrectSoFar = false;
                }
            }
        });

        if (allCorrectSoFar && typedText === cleanPhrase) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            loadNewPhrase();
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}`;
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        inputField.removeEventListener('input', handleInput);
        inputField.disabled = true;
        alert(`ゲーム終了！あなたのスコアは ${score} です。`);
    }

    // --- Event Listeners ---
    titleImage.addEventListener('click', () => {
        titleScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        startGame();
    });
});