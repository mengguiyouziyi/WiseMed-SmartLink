import os

files = [
    "services/ai-infer-service/main.py",
    "services/auth-service/main.py",
    "services/pacs-gw-service/main.py",
    "services/pacs-gw-service/tests/test_main.py"
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Strip trailing whitespace from content
    content = content.rstrip() + '\n'
    
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Fixed {file_path}")
