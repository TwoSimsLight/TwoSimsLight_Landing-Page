// ============ GAME STATE ============
var GAME_STATE = { START: 'start', MEMORY: 'memory', TRIVIA: 'trivia', END: 'end' };
var currentState = GAME_STATE.START;
var totalAttempts = 0;
var totalCorrect = 0;
var timer = 0;
var timerInterval = null;
var totalScore = 0;
var selectedGender = null;
var currentLifeStage = 0;
var currentTriviaIndex = 0;
var roundNumber = 0;
var timerExpired = false;
var isTrivia = false;
var isUserPaused = false;

// ============ AUDIO SYSTEM (HTML5 Audio for local files) ============
function playSound(name) {
    try {
        var a = new Audio('assets/' + name);
        a.volume = 0.6;
        a.play().catch(function(e) {
            console.warn('Audio play blocked or failed:', e);
        });
    } catch(e) {}
}

// Preload the most used sounds so they are cached by the browser
(function preloadSounds() {
    new Audio('assets/sound_id4.mp3').load();
    new Audio('assets/sound_id2.mp3').load();
    new Audio('assets/sound_id1.mp3').load();
})();

// ============ MEMORY GAME VARIABLES ============
var flippedCards = [];
var matchedPairs = 0;
var isBoardLocked = false;

// ============ DOM ELEMENTS ============
var screens = {
    start: document.getElementById('screen-start'),
    memory: document.getElementById('screen-memory'),
    trivia: document.getElementById('screen-trivia'),
    end: document.getElementById('screen-end')
};

// Init UI Text
document.getElementById('intro-p1').innerHTML = GAME_TEXT.introText1;
document.getElementById('intro-p2').innerHTML = GAME_TEXT.introText2;

// Add a pause overlay for the clock
var clockInner = document.querySelector('.clock-inner');
var pauseOverlay = document.createElement('div');
pauseOverlay.style.position = 'absolute';
pauseOverlay.style.inset = '0';
pauseOverlay.style.background = 'white';
pauseOverlay.style.borderRadius = '50%';
pauseOverlay.style.display = 'none';
pauseOverlay.style.flexDirection = 'column';
pauseOverlay.style.justifyContent = 'center';
pauseOverlay.style.alignItems = 'center';
pauseOverlay.style.fontSize = '9px';
pauseOverlay.style.color = '#4A73A6';
pauseOverlay.style.fontWeight = 'bold';
pauseOverlay.style.textAlign = 'center';
pauseOverlay.style.lineHeight = '1';
pauseOverlay.style.zIndex = '10';
pauseOverlay.innerHTML = GAME_TEXT.pauseClockText1 + '<br>' + GAME_TEXT.pauseClockText2;
clockInner.appendChild(pauseOverlay);

// Handle pause button click
document.getElementById('pause-btn').onclick = function() {
    isUserPaused = !isUserPaused;
    var btn = document.getElementById('pause-btn');
    if (isUserPaused) {
        btn.classList.add('is-paused');
        pauseOverlay.innerHTML = GAME_TEXT.pauseClockText3; // 'clock stopped'
        pauseOverlay.style.display = 'flex';
    } else {
        btn.classList.remove('is-paused');
        if (isTrivia) {
            pauseOverlay.innerHTML = GAME_TEXT.pauseClockText1 + '<br>' + GAME_TEXT.pauseClockText2;
            pauseOverlay.style.display = 'flex';
        } else {
            pauseOverlay.style.display = 'none';
        }
    }
};

// ============ UTILITY ============
function formatNum(num) { return num.toString().padStart(3, '0'); }

function switchScreen(newState) {
    Object.values(screens).forEach(function(s) {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    currentState = newState;
    screens[newState].classList.remove('hidden');
    screens[newState].classList.add('active');
}

function updateStats() {
    document.getElementById('stat-attempts').textContent = formatNum(totalAttempts);
    document.getElementById('stat-correct').textContent = formatNum(totalCorrect);
}

// ============ TIMER ============
function startTimer() {
    timer = 0;
    timerExpired = false;
    isTrivia = false;
    isUserPaused = false;
    document.getElementById('pause-btn').classList.remove('is-paused');
    pauseOverlay.style.display = 'none';
    clearInterval(timerInterval);
    var hand = document.getElementById('clock-hand');
    hand.style.transform = 'translateX(-50%) rotate(0deg)';
    
    timerInterval = setInterval(function() {
        if (isTrivia || isUserPaused) return; // Pause timer
        
        timer++;
        hand.style.transform = 'translateX(-50%) rotate(' + (timer * 4) + 'deg)';
        
        if (timer >= 90) {
            clearInterval(timerInterval);
            timerExpired = true;
            endGame(); // End immediately when clock hits 60
        }
    }, 1000);
}

// ============ MEMORY GAME ============
function initMemoryGame() {
    var board = document.getElementById('memory-board');
    board.innerHTML = '';
    matchedPairs = 0;
    flippedCards = [];
    isBoardLocked = false;
    updateStats();

    // Pick 8 random card images for 4x4 grid
    var allCards = TAG6_IMAGES.slice();
    for (var i = allCards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = allCards[i]; allCards[i] = allCards[j]; allCards[j] = temp;
    }
    var selected = allCards.slice(0, 8);
    var deck = selected.concat(selected);
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deck[i]; deck[i] = deck[j]; deck[j] = temp;
    }

    deck.forEach(function(imgName) {
        var card = document.createElement('div');
        card.className = 'mem-card';
        card.dataset.icon = imgName;

        var front = document.createElement('div');
        front.className = 'mem-front';
        front.style.backgroundImage = "url('assets/" + imgName + "')";

        var back = document.createElement('div');
        back.className = 'mem-back';

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', function() { handleCardClick(card); });
        board.appendChild(card);
    });
}

function handleCardClick(card) {
    if (isBoardLocked || timerExpired || isUserPaused) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Play flip/click sound
    playSound('sound_id4.mp3');
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        totalAttempts++;
        updateStats();
        isBoardLocked = true;

        var card1 = flippedCards[0];
        var card2 = flippedCards[1];
        flippedCards = [];

        if (card1.dataset.icon === card2.dataset.icon) {
            // === CORRECT MATCH ===
            playSound('sound_id2.mp3'); // short ding
            totalCorrect++;
            matchedPairs++;
            totalScore += 100;
            updateStats();
            setTimeout(function() {
                if (timerExpired) return; // double check
                card1.classList.add('matched');
                card2.classList.add('matched');
                isBoardLocked = false;

                // All 8 pairs found?
                if (matchedPairs === 8) {
                    roundNumber++;
                    playSound('sound_id3.mp3'); // round complete jingle
                    setTimeout(function() {
                        if (timerExpired) return;
                        // Go to trivia round & Pause Clock
                        isTrivia = true;
                        pauseOverlay.innerHTML = GAME_TEXT.pauseClockText1 + '<br>' + GAME_TEXT.pauseClockText2;
                        pauseOverlay.style.display = 'flex';
                        switchScreen(GAME_STATE.TRIVIA);
                        initTriviaGame();
                    }, 800);
                }
            }, 250);
        } else {
            // === WRONG MATCH ===
            playSound('sound_id1.mp3'); // buzz
            setTimeout(function() {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                isBoardLocked = false;
            }, 400);
        }
    }
}

// ============ TRIVIA ============
var questionsForRound = [];
var qIndex = 0;
var triviaLocked = false;

function initTriviaGame() {
    questionsForRound = [];
    // Pick 3 questions per trivia round
    for (var i = 0; i < 3; i++) {
        questionsForRound.push(TRIVIA_DATA[currentTriviaIndex % TRIVIA_DATA.length]);
        currentTriviaIndex++;
    }
    qIndex = 0;
    triviaLocked = false;
    showQuestion();
}

function showQuestion() {
    if (timerExpired) return;
    
    if (qIndex >= questionsForRound.length) {
        // Trivia round done!
        currentLifeStage++;
        // Resume Timer and Go back to memory
        isTrivia = false;
        if (!isUserPaused) pauseOverlay.style.display = 'none';
        switchScreen(GAME_STATE.MEMORY);
        initMemoryGame();
        return;
    }

    var q = questionsForRound[qIndex];
    document.getElementById('trivia-question').innerHTML = q.question;
    var opts = document.getElementById('trivia-options');
    opts.innerHTML = '';
    triviaLocked = false;

    q.options.forEach(function(opt, idx) {
        var b = document.createElement('button');
        b.className = 'opt-btn';
        b.innerHTML = '<strong>' + opt + '</strong>';
        b.onclick = function() {
            if (triviaLocked || isUserPaused) return;
            triviaLocked = true;
            
            totalAttempts++;
            if (idx === q.answer) {
                playSound('sound_id2.mp3');
                totalScore += 200;
                totalCorrect++;
            } else {
                playSound('sound_id1.mp3');
            }
            updateStats();
            qIndex++;
            setTimeout(function() { showQuestion(); }, 500);
        };
        opts.appendChild(b);
    });
}

// ============ END GAME ============
function endGame() {
    clearInterval(timerInterval);
    isTrivia = false;
    pauseOverlay.style.display = 'none';
    playSound('sound_id322.mp3'); // celebration!
    totalScore = Math.max(0, totalScore);

    document.getElementById('stat-score').textContent = formatNum(totalScore);
    document.getElementById('stat-score').style.color = '#81b43f';

    // Determine life stage based on score
    var stage;
    if (totalScore >= 3000) stage = 6;
    else if (totalScore >= 2500) stage = 5;
    else if (totalScore >= 2000) stage = 4;
    else if (totalScore >= 1500) stage = 3;
    else if (totalScore >= 800) stage = 2;
    else stage = 1;

        var maleStages = ['m_stage1.jpg', 'm_stage2.jpg', 'm_stage3.jpg', 'm_stage4.jpg', 'couple.jpg', 'family.jpg'];
    var femaleStages = ['f_stage1.jpg', 'f_stage2.jpg', 'f_stage3.jpg', 'f_stage4.jpg', 'couple.jpg', 'family.jpg'];
    var stageImages = selectedGender === 'male' ? maleStages : femaleStages;
    var finalImg = stageImages[Math.min(stage - 1, 5)];
    var msgKey = 'rewardText' + stage;
    var imgHtml = '<div style="display:flex; justify-content:center;"><div style="width:140px; height:240px; margin-bottom:15px;"><img src="assets/' + finalImg + '" style="width:100%; height:100%; object-fit:contain; mix-blend-mode: multiply;"></div></div>';
    if (!GAME_TEXT[msgKey]) {
        msgKey = 'rewardText1';
    }

    document.getElementById('res-message').innerHTML = imgHtml + GAME_TEXT[msgKey];
    document.getElementById('btn-replay').innerHTML = '<strong>' + (GAME_TEXT.rewardText0 || 'play again') + '</strong>';

    switchScreen(GAME_STATE.END);
}

// ============ GAME START ============
function startGame(gender) {
    selectedGender = gender;
    totalScore = 0;
    totalAttempts = 0;
    totalCorrect = 0;
    currentLifeStage = 0;
    roundNumber = 0;
    timerExpired = false;
    isTrivia = false;
    isUserPaused = false;
    pauseOverlay.style.display = 'none';
    
    // Reset Nickname section
    var saveBtn = document.getElementById('btn-save-score');
    if(saveBtn) saveBtn.disabled = false;
    var nickInput = document.getElementById('player-nickname');
    if(nickInput) nickInput.value = '';

    document.getElementById('pause-btn').classList.remove('is-paused');
    document.getElementById('stat-score').textContent = '';
    
    switchScreen(GAME_STATE.MEMORY);
    initMemoryGame();
    startTimer();
}

document.getElementById('btn-male').onclick = function() { startGame('male'); };
document.getElementById('btn-female').onclick = function() { startGame('female'); };
document.getElementById('btn-replay').onclick = function() { switchScreen(GAME_STATE.START); };

// ============ SNEAK PEEK CAROUSEL ============
var sneakTrack = document.getElementById('sneak-track');
var sneakSrcs = [
    'assets/image_42.jpg', 'assets/image_44.jpg', 'assets/image_46.jpg', 'assets/image_48.jpg', 
    'assets/image_50.jpg', 'assets/image_52.jpg', 'assets/image_54.jpg', 'assets/image_56.jpg', 
    'assets/image_58.jpg', 'assets/image_60.jpg', 'assets/image_62.jpg', 'assets/image_64.jpg', 
    'assets/image_66.jpg', 'assets/image_68.jpg', 'assets/image_70.jpg', 'assets/credits.png'
];
var sIdx = 0;

if (sneakTrack) {
    sneakSrcs.forEach(function(src) {
        var img = document.createElement('img');
        img.src = src;
        img.style.width = '200px';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.flexShrink = '0';
        sneakTrack.appendChild(img);
    });
}

function updateSneakSlide() {
    if (sneakTrack) {
        sneakTrack.style.transform = 'translateX(-' + (sIdx * 200) + 'px)';
    }
}

document.getElementById('sneak-prev').onclick = function() {
    sIdx = (sIdx - 1 + sneakSrcs.length) % sneakSrcs.length;
    updateSneakSlide();
};
document.getElementById('sneak-next').onclick = function() {
    sIdx = (sIdx + 1) % sneakSrcs.length;
    updateSneakSlide();
};

setInterval(function() {
    sIdx = (sIdx + 1) % sneakSrcs.length;
    updateSneakSlide();
}, 25000);

// ============ FOOTER DOTS ANIMATION ============
setInterval(function() {
    var dots = document.querySelectorAll('.dot');
    if (dots.length === 0) return;
    var act = 0;
    dots.forEach(function(d, i) {
        if (d.classList.contains('active')) act = i;
        d.classList.remove('active');
    });
    dots[(act + 1) % dots.length].classList.add('active');
}, 600);







// ============ FIREBASE CONFIGURATION (GLOBAL LEADERBOARD) ============
// TODO: Substitua esses valores com as chaves reais do seu projeto Firebase!
  const firebaseConfig = {
    apiKey: "AIzaSyAKiRPtarw2XKRBDHj9qMGoNcfhWCi2Q44",
    authDomain: "grow-your-sims.firebaseapp.com",
    databaseURL: "https://grow-your-sims-default-rtdb.firebaseio.com",
    projectId: "grow-your-sims",
    storageBucket: "grow-your-sims.firebasestorage.app",
    messagingSenderId: "653013250471",
    appId: "1:653013250471:web:a21fb6ef0b5682651c4682",
    measurementId: "G-KPWGC45LE7"
  };

// Inicializar Firebase
var db = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        
        // ==== ANALYTICS: Registrar Acesso ====
        try {
            db.ref('stats/pageViews').transaction(function(currentViews) {
                return (currentViews || 0) + 1;
            });
        } catch(err) {
            console.error("Erro ao registrar view:", err);
        }

    } catch(e) {
        console.warn("Firebase não configurado ainda.");
    }
}

// ============ AD SCREEN LOGIC ============
var adOverlay = document.getElementById('ad-overlay');
var btnSkipAd = document.getElementById('btn-skip-ad');
var adTimerSpan = document.getElementById('ad-timer');
var adTimeLeft = 15;

if (adOverlay && btnSkipAd && adTimerSpan) {
    adOverlay.style.display = 'flex'; // Mostrar imediatamente ao carregar o site
    
    var adInterval = setInterval(function() {
        adTimeLeft--;
        if (adTimeLeft > 0) {
            adTimerSpan.textContent = adTimeLeft;
        } else {
            clearInterval(adInterval);
            adTimerSpan.parentElement.textContent = "You can play now!";
            btnSkipAd.textContent = "Play Now";
            btnSkipAd.disabled = false;
        }
    }, 1000);

    btnSkipAd.onclick = function() {
        // Open the monetization smart-link in a new tab
        window.open('https://www.effectivecpmnetwork.com/sfip9zrqx?key=ed87713c7f6e82581ab71ce4b0bc5b0b', '_blank');
        // Hide the ad overlay to let the player play
        adOverlay.style.display = 'none';
    };
}

// ============ LEADERBOARD LOGIC ============
function saveScoreToFirebase(nickname, corrects, attempts) {
    if (!db) {
        alert("Firebase não configurado! (Edite o script.js com suas chaves)");
        return;
    }
    
    var newScoreRef = db.ref('scores').push();
    newScoreRef.set({
        nickname: nickname,
        corrects: corrects,
        attempts: attempts,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        var msg = document.getElementById('save-msg');
        if (msg) {
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
        }
    }).catch((e) => {
        console.error("Erro ao salvar:", e);
        alert("Error saving to database.");
    });
}

function updateLeaderboardUI() {
    if (!db) {
        document.getElementById('top-best-list').innerHTML = '<div style="padding: 10px; text-align: center; color:#999;">Waiting for Firebase Setup...</div>';
        document.getElementById('top-worst-list').innerHTML = '<div style="padding: 10px; text-align: center; color:#999;">Waiting for Firebase Setup...</div>';
        return;
    }
    
    db.ref('scores').on('value', function(snapshot) {
        var scores = [];
        snapshot.forEach(function(child) {
            scores.push(child.val());
        });
        
        var bestScores = scores.slice().sort(function(a, b) {
            if (b.corrects !== a.corrects) return b.corrects - a.corrects;
            return a.attempts - b.attempts;
        });
        
        var worstScores = scores.slice().sort(function(a, b) {
            if (b.attempts !== a.attempts) return b.attempts - a.attempts;
            return a.corrects - b.corrects;
        });
        
        renderRankList('top-best-list', bestScores.slice(0, 10));
        renderRankList('top-worst-list', worstScores.slice(0, 10));
    });
}

function renderRankList(elementId, list) {
    var container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';
    
    if (list.length === 0) {
        container.innerHTML = '<div style="padding: 10px; text-align: center;">No scores yet.</div>';
        return;
    }
    
    list.forEach(function(score) {
        var row = document.createElement('div');
        row.className = 'rank-row';
        row.innerHTML = '<span>' + score.nickname + '</span><span>' + score.corrects + '</span><span>' + score.attempts + '</span>';
        container.appendChild(row);
    });
}

// Initialize Leaderboard on load
updateLeaderboardUI();

var btnSaveScore = document.getElementById('btn-save-score');
if (btnSaveScore) {
    btnSaveScore.onclick = function() {
        var nickname = document.getElementById('player-nickname').value.trim();
        if (nickname === "") {
            alert("Please enter a nickname!");
            return;
        }
        saveScoreToFirebase(nickname, totalCorrect, totalAttempts);
        btnSaveScore.disabled = true;
    };
}


// ============ OS BUTTONS SMART-LINK ============
var osBtns = document.querySelectorAll('.os-btn');
osBtns.forEach(function(btn) {
    btn.onclick = function() {
        window.open('https://www.effectivecpmnetwork.com/sfip9zrqx?key=ed87713c7f6e82581ab71ce4b0bc5b0b', '_blank');
    };
});
