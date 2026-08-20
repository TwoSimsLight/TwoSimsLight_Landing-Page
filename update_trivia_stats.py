with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_logic = '''            if (idx === q.answer) {
                playSound('sound_id2.mp3');
                totalScore += 200;
            } else {
                playSound('sound_id1.mp3');
            }
            qIndex++;
            setTimeout(function() { showQuestion(); }, 500);'''

new_logic = '''            totalAttempts++;
            if (idx === q.answer) {
                playSound('sound_id2.mp3');
                totalScore += 200;
                totalCorrect++;
            } else {
                playSound('sound_id1.mp3');
            }
            updateStats();
            qIndex++;
            setTimeout(function() { showQuestion(); }, 500);'''

text = text.replace(old_logic, new_logic)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)
