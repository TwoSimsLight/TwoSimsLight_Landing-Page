with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

end_screen = '''<div id="screen-end" class="screen hidden text-screen">
                            <p id="res-message" style="margin-top:15px; font-weight:bold;"></p>
                            
                            <div id="nickname-section" style="margin-top:20px; padding: 10px; background: #f1f6fc; border: 1px solid #b7cde5; border-radius: 8px;">
                                <p style="margin-bottom: 5px; color: #264a7f; font-weight: bold;">Salvar no Ranking Global</p>
                                <input type="text" id="player-nickname" placeholder="Digite seu Nickname" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc; text-align: center; width: 150px;">
                                <button id="btn-save-score" style="padding: 5px 10px; background: #85a4ce; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Salvar</button>
                                <p id="save-msg" style="color: #9bc45c; font-size: 12px; margin-top: 5px; display: none;">Salvo com sucesso!</p>
                            </div>

                            <button id="btn-replay" class="action-btn" style="margin-top:20px;"><strong>Play Again</strong></button>
                        </div>'''

import re
text = re.sub(r'<div id="screen-end"[^>]*>.*?</div>\s*</div>', end_screen + '\n                    </div>', text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
