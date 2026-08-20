with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add viewport meta and Firebase SDKs
meta_tags = '''<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- Firebase SDK (v8 compat for simplicity) -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>'''
html = html.replace('<meta charset="UTF-8">', meta_tags)

# Wrap .os-window and add Leaderboard
wrapper_start = '''<div class="app-container">
    <div class="os-window" id="os-window">'''
html = html.replace('<div class="os-window">', wrapper_start)

leaderboard_html = '''    </div> <!-- End os-window -->

    <div class="leaderboard-panel">
        <h2>Global Rankings</h2>
        
        <div class="rank-section">
            <h3 class="best-title">Top 10 Melhores</h3>
            <div class="rank-table-header"><span>Jogador</span><span>Acertos</span><span>Tentativas</span></div>
            <div id="top-best-list" class="rank-list">Carregando...</div>
        </div>
        
        <div class="rank-section">
            <h3 class="worst-title">Top 10 Piores</h3>
            <div class="rank-table-header"><span>Jogador</span><span>Acertos</span><span>Tentativas</span></div>
            <div id="top-worst-list" class="rank-list">Carregando...</div>
        </div>
    </div>
</div>

<!-- AD SCREEN OVERLAY -->
<div id="ad-overlay" style="display: none;">
    <div class="ad-content">
        <h2>Patrocinador</h2>
        <div class="ad-video-placeholder">
            <span>Anúncio em exibição...</span>
        </div>
        <p>O seu jogo começará em: <span id="ad-timer">15</span> segundos</p>
        <button id="btn-skip-ad" disabled>Aguarde...</button>
    </div>
</div>
'''

# Find the last closing tag of os-window. 
# In index.html, it's just before <script src="data.js">
html = html.replace('    <script src="data.js">', leaderboard_html + '\n    <script src="data.js">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
