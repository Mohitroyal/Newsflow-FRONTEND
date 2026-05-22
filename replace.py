import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple replacements
    if 'config.py' in filepath:
        if 'FRONTEND_URL' not in content:
            content = content.replace('class Settings(BaseSettings):', 'class Settings(BaseSettings):\n    FRONTEND_URL: str = "https://newscraft-ai.vercel.app"\n    BACKEND_URL: str = "https://mohitroyal-newsflow-backend.hf.space"')
        content = content.replace('"http://localhost:3000"', 'FRONTEND_URL')
        content = content.replace('"redis://localhost:6379/0"', '"redis://redis:6379/0"')
        content = content.replace('"redis://localhost:6379/1"', '"redis://redis:6379/1"')
        content = content.replace('"redis://localhost:6379/2"', '"redis://redis:6379/2"')
    
    else:
        # For other files, we should use settings.FRONTEND_URL and settings.BACKEND_URL
        content = content.replace('http://localhost:3000', '" + settings.FRONTEND_URL + "')
        content = content.replace('http://localhost:8000', '" + settings.BACKEND_URL + "')
        content = content.replace('http://localhost:8001', '" + settings.BACKEND_URL + "')
        
        # Some manual fixing for f-strings
        content = content.replace('f"" + settings.BACKEND_URL + "', 'f"{settings.BACKEND_URL}')
        content = content.replace('f"" + settings.FRONTEND_URL + "', 'f"{settings.FRONTEND_URL}')

        # Standard strings fix
        content = content.replace('"" + settings.BACKEND_URL + "', 'settings.BACKEND_URL + "')
        content = content.replace('"" + settings.FRONTEND_URL + "', 'settings.FRONTEND_URL + "')
        
        content = content.replace('settings.FRONTEND_URL + ""', 'settings.FRONTEND_URL')
        content = content.replace('settings.BACKEND_URL + ""', 'settings.BACKEND_URL')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = glob.glob('backend/app/**/*.py', recursive=True)
for f in files:
    replace_in_file(f)
print('Done replacing localhost in backend.')
