with open('script.js', 'a', encoding='utf-8') as f:
    f.write('''

// ============ OS BUTTONS SMART-LINK ============
var osBtns = document.querySelectorAll('.os-btn');
osBtns.forEach(function(btn) {
    btn.onclick = function() {
        window.open('https://www.effectivecpmnetwork.com/sfip9zrqx?key=ed87713c7f6e82581ab71ce4b0bc5b0b', '_blank');
    };
});
''')
