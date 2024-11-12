import os
import re
from pathlib import Path

def find_and_fix_imports():
    """Find and list all case-sensitive import issues"""
    backend_dir = Path(__file__).resolve().parent.parent
    
    # Patterns to search for
    patterns = [
        r'from apps\.',  # From imports
        r'import apps\.',  # Direct imports
        r"'apps\.",      # String references
        r'"apps\.',      # String references
    ]
    
    # Files to check (by extension)
    extensions = ['.py']
    
    issues_found = []
    
    # Walk through all Python files
    for root, _, files in os.walk(backend_dir):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check for patterns
                    for pattern in patterns:
                        matches = re.finditer(pattern, content)
                        for match in matches:
                            issues_found.append({
                                'file': os.path.relpath(filepath, backend_dir),
                                'line': content.count('\n', 0, match.start()) + 1,
                                'match': match.group(),
                                'fix': match.group().replace('Apps.', 'apps.')
                            })
    
    return issues_found

def print_findings(issues):
    """Print found issues in a readable format"""
    if not issues:
        print("No case-sensitive import issues found!")
        return
        
    print("\nFound case-sensitive import issues:")
    print("-" * 80)
    
    for issue in issues:
        print(f"File: {issue['file']}")
        print(f"Line: {issue['line']}")
        print(f"Found: {issue['match']}")
        print(f"Fix to: {issue['fix']}")
        print("-" * 80)

if __name__ == '__main__':
    issues = find_and_fix_imports()
    print_findings(issues) 