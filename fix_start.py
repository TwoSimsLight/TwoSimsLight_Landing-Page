with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = '''function startGame(gender) {
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
'''

import re
text = re.sub(r'function startGame\(gender\) \{.*?isUserPaused = false;\n\s*pauseOverlay\.style\.display = \'none\';', replacement, text, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)
