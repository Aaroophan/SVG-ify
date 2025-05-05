"""
This module contains the default font data to be used when no font is provided
or when the provided font is invalid.
"""

# This is a base64 encoded version of a simple open-source font
# You should replace this with an actual base64 encoded font file
DEFAULT_FONT_DATA = """
AAEAAAAOAIAAAwBgRkZUTYBH3FQAAAA4AAAAHEdERUYAJwANAAAAWAAAAB5PUy8yVe6P/gAAAigA
AABgY21hcAAP388AAAKIAAAAZGdhc3D//wADAAABPAAAAAhnbHlmMIJYzAAAApgAAAGkaGVhZBPS
LswAAACcAAAANmhoZWEHvwPIAAACBAAAACRobXR4B9AAAAAAAcQAAAASbG9jYQBaAKMAAAJ8AAAA
Dm1heHAAEwAyAAACJAAAACBuYW1lL+JOugAABDAAAAGGcG9zdAADAAAAAAW4AAAAIAABAAAAAQAA
"""[1:-1].replace('\n', '')  # Removing first and last newlines and all whitespace 