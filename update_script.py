with open('script.js', 'a', encoding='utf-8') as f:
    f.write('''

// ============ FIREBASE CONFIGURATION (GLOBAL LEADERBOARD) ============
// TODO: Substitua esses valores com as chaves reais do seu projeto Firebase!
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
var db = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
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
            adTimerSpan.parentElement.textContent = "Você já pode jogar!";
            btnSkipAd.textContent = "Jogar Agora";
            btnSkipAd.disabled = false;
        }
    }, 1000);

    btnSkipAd.onclick = function() {
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
        alert("Erro ao salvar no banco de dados.");
    });
}

function updateLeaderboardUI() {
    if (!db) {
        document.getElementById('top-best-list').innerHTML = '<div style="padding: 10px; text-align: center; color:#999;">Aguardando Configuração do Firebase...</div>';
        document.getElementById('top-worst-list').innerHTML = '<div style="padding: 10px; text-align: center; color:#999;">Aguardando Configuração do Firebase...</div>';
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
        container.innerHTML = '<div style="padding: 10px; text-align: center;">Nenhum placar ainda.</div>';
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
            alert("Por favor, digite um nickname!");
            return;
        }
        saveScoreToFirebase(nickname, totalCorrect, totalAttempts);
        btnSaveScore.disabled = true;
    };
}
''')
