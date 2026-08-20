with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
old_onclick = '''    btnSkipAd.onclick = function() {
        adOverlay.style.display = 'none';
    };'''

new_onclick = '''    btnSkipAd.onclick = function() {
        // Open the monetization smart-link in a new tab
        window.open('https://www.effectivecpmnetwork.com/sfip9zrqx?key=ed87713c7f6e82581ab71ce4b0bc5b0b', '_blank');
        // Hide the ad overlay to let the player play
        adOverlay.style.display = 'none';
    };'''

text = text.replace(old_onclick, new_onclick)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)
