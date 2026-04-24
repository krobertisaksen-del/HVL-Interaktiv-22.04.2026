import os
import sys

def replace_fetch(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'apiFetch' not in content:
        # Prepend the import
        import_stmt = "import { apiFetch } from './lib/apiFetch';\n"
        if filepath.startswith('components/') or filepath.startswith('hooks/'):
            import_stmt = "import { apiFetch } from '../lib/apiFetch';\n"
        
        # We find the last import and insert it there.
        # But for simplicity, we just replace `fetch(`/`fetch (` with apiFetch. Wait, we may have other fetches.
        pass

    # We do a naive replace:
    # First prepend the import statement if needed
    if 'apiFetch' not in content:
        import_stmt = "import { apiFetch } from './lib/apiFetch';\n"
        if filepath.startswith('components/') or filepath.startswith('hooks/'):
            import_stmt = "import { apiFetch } from '../lib/apiFetch';\n"
        content = import_stmt + content
        
    content = content.replace(" fetch(", " apiFetch(")
    content = content.replace("await fetch(", "await apiFetch(")
    
    with open(filepath, 'w') as f:
        f.write(content)

replace_fetch('App.tsx')
replace_fetch('components/Player.tsx')
replace_fetch('hooks/useMediaUpload.ts')
