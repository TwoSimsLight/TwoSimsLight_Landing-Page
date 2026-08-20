with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add left side ad panel inside app-container
side_ad = '''<div class="side-ad-panel">
        <p style="font-size: 10px; color: #888; text-align: center; margin-bottom: 5px;">ADVERTISEMENT</p>
        <div id="ad-160x300-container" style="width: 160px; height: 300px; background: #222; display: flex; justify-content: center; align-items: center; border: 1px solid #444;">
            <!-- ============================================== -->
            <!-- COLOQUE O CÓDIGO DO BANNER 160x300 AQUI DENTRO -->
            <!-- ============================================== -->
            <span style="color:#666; font-size: 12px;">Banner 160x300</span>
        </div>
        
        <div id="ad-320x50-container" style="width: 160px; height: 300px; background: #222; display: flex; justify-content: center; align-items: center; border: 1px solid #444; margin-top: 20px;">
            <!-- ============================================== -->
            <!-- (Opcional) COLOQUE OUTRO BANNER AQUI SE QUISER -->
            <!-- ============================================== -->
            <span style="color:#666; font-size: 12px;">Espaço Adicional</span>
        </div>
    </div>

    <div class="os-window" id="os-window">'''

text = text.replace('<div class="os-window" id="os-window">', side_ad)

# Update the ad-video-placeholder inside ad-overlay for the 300x250 banner
old_placeholder = '''<div class="ad-video-placeholder">
            <span>Anncio em exibio...</span>
        </div>'''
new_placeholder = '''<div class="ad-video-placeholder" style="background: transparent; border: none;">
            <div style="width: 300px; height: 250px; background: #222; display: flex; justify-content: center; align-items: center; margin: 0 auto; border: 1px solid #444;">
                <!-- ============================================== -->
                <!-- COLOQUE O CÓDIGO DO BANNER 300x250 AQUI DENTRO -->
                <!-- ============================================== -->
                <span style="color:#666;">Banner 300x250</span>
            </div>
        </div>'''
text = text.replace(old_placeholder, new_placeholder)

# Add Popunder and Social Bar placeholders before </body>
bottom_scripts = '''    <!-- ============================================== -->
    <!-- COLOQUE O CÓDIGO DO POPUNDER E SOCIAL BAR AQUI -->
    <!-- ============================================== -->
    
    <script src="data.js"></script>'''
text = text.replace('    <script src="data.js"></script>', bottom_scripts)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
