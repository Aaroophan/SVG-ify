import xml.dom.minidom as minidom
from typing import Dict, List, Any, Tuple
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import io
import base64
import os

def get_font_path(font_family: str) -> str:
    """
    Get the path to the font file based on the font family name.
    This is a mapping of font family names to their file paths.
    """
    # Get the absolute path to the fonts directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    fonts_dir = os.path.join(current_dir, 'fonts')
    
    # Normalize font family name by removing quotes and extra spaces
    font_family = font_family.strip('"\'')
    font_family = font_family.split(',')[0].strip()  # Take the first font in the fallback list
    
    # This is a basic mapping - you should expand this with actual font files
    font_mapping = {
        # Arial family
        "Arial": os.path.join(fonts_dir, "arial.ttf"),
        "Arial Bold": os.path.join(fonts_dir, "arialbd.ttf"),
        "Arial Italic": os.path.join(fonts_dir, "ariali.ttf"),
        "Arial Bold Italic": os.path.join(fonts_dir, "arialbi.ttf"),
        "Arial Black": os.path.join(fonts_dir, "ariblk.ttf"),
        
        # Arial Narrow family
        "Arial Narrow": os.path.join(fonts_dir, "arialn.TTF"),
        "Arial Narrow Bold": os.path.join(fonts_dir, "ARIALNB.TTF"),
        "Arial Narrow Bold Italic": os.path.join(fonts_dir, "ARIALNBI.TTF"),
        "Arial Narrow Italic": os.path.join(fonts_dir, "ARIALNI.TTF"),
        
        # Times family
        "Times": os.path.join(fonts_dir, "times.ttf"),
        "Times New Roman": os.path.join(fonts_dir, "times.ttf"),
        "Times Bold": os.path.join(fonts_dir, "timesbd.ttf"),
        "Times Bold Italic": os.path.join(fonts_dir, "timesbi.ttf"),
        "Times Italic": os.path.join(fonts_dir, "timesi.ttf"),
        
        # Google Fonts
        "Roboto": os.path.join(fonts_dir, "Roboto-Regular.ttf"),
        "Open Sans": os.path.join(fonts_dir, "OpenSans-Regular.ttf"),
        "Lato": os.path.join(fonts_dir, "Lato-Regular.ttf"),
        "Montserrat": os.path.join(fonts_dir, "Montserrat-Regular.ttf"),
        "Poppins": os.path.join(fonts_dir, "Poppins-Regular.ttf"),
        
        # Script/handwriting fonts
        "Brush Script MT": os.path.join(fonts_dir, "BRUSHSCI.TTF"),
        "Freestyle Script": os.path.join(fonts_dir, "FREESCPT.TTF"),
        "Mistral": os.path.join(fonts_dir, "MISTRAL.TTF"),
        "Segoe Script": os.path.join(fonts_dir, "segoesc.ttf"),
        "Segoe Print": os.path.join(fonts_dir, "segoepr.ttf"),
        "Ink Free": os.path.join(fonts_dir, "Inkfree.ttf"),
        "Matura MT Script Capitals": os.path.join(fonts_dir, "MATURASC.TTF"),
        "Lucida Handwriting": os.path.join(fonts_dir, "LHANDW.TTF"),
        
        # Monospace fonts
        "Courier New": os.path.join(fonts_dir, "cour.ttf"),
        "Courier New Bold": os.path.join(fonts_dir, "courbd.ttf"),
        "Courier New Italic": os.path.join(fonts_dir, "couri.ttf"),
        "Courier New Bold Italic": os.path.join(fonts_dir, "courbi.ttf"),
        
        # Decorative fonts
        "Showcard Gothic": os.path.join(fonts_dir, "SHOWG.TTF"),
        "Agency FB": os.path.join(fonts_dir, "AGENCYR.TTF"),
        "Agency FB Bold": os.path.join(fonts_dir, "AGENCYB.TTF"),
        "Harlow Solid Italic": os.path.join(fonts_dir, "HARLOWSI.TTF"),
        
        # System fonts
        "Helvetica": os.path.join(fonts_dir, "helvetica.ttf"),
        "Verdana": os.path.join(fonts_dir, "verdana.ttf"),
        "Georgia": os.path.join(fonts_dir, "georgia.ttf"),
        "Tahoma": os.path.join(fonts_dir, "tahoma.ttf"),
        "Trebuchet MS": os.path.join(fonts_dir, "trebuc.ttf"),
        "Comic Sans MS": os.path.join(fonts_dir, "comic.ttf"),
        
        # Additional variants
        "Verdana Bold": os.path.join(fonts_dir, "verdanab.ttf"),
        "Verdana Italic": os.path.join(fonts_dir, "verdanai.ttf"),
        "Verdana Bold Italic": os.path.join(fonts_dir, "verdanaz.ttf"),
        "Georgia Bold": os.path.join(fonts_dir, "georgiab.ttf"),
        "Georgia Italic": os.path.join(fonts_dir, "georgiai.ttf"),
        "Georgia Bold Italic": os.path.join(fonts_dir, "georgiaz.ttf")
    }
    
    font_path = font_mapping.get(font_family)
    if not font_path:
        raise ValueError(f"Font family '{font_family}' not supported. Supported fonts are: {', '.join(font_mapping.keys())}")
    
    if not os.path.exists(font_path):
        raise ValueError(f"Font file not found: {font_path}. Please download the font file.")
    
    return font_path

def generate_svg(text: str, font_family: str, font_size: int, fill_color: str) -> str:
    """
    Generate an SVG with individual path elements for each character's strokes.
    
    Args:
        text: The text to convert to SVG
        font_family: The font family to use
        font_size: Font size in pixels
        fill_color: Fill color for the SVG paths
        
    Returns:
        SVG as a string
    """
    # Create a new SVG document
    doc = minidom.getDOMImplementation().createDocument(None, "svg", None)
    svg = doc.documentElement
    
    # Set SVG namespace
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    
    # Load the font
    try:
        font_path = get_font_path(font_family)
        font = TTFont(font_path)
    except Exception as e:
        raise ValueError(f"Failed to load font: {str(e)}")
    
    # Get units per em for scaling
    units_per_em = font['head'].unitsPerEm
    scale_factor = font_size / units_per_em
    
    # Calculate dimensions
    total_width = 0
    max_height = font_size * 1.2
    
    # Create a group for each character
    current_x = 0
    for char in text:
        # Get the glyph for the character
        glyph_set = font.getGlyphSet()
        glyph_name = font.getBestCmap().get(ord(char), '.notdef')
        
        if glyph_name in glyph_set:
            glyph = glyph_set[glyph_name]
            
            # Create a group for this character
            char_group = doc.createElement("g")
            char_group.setAttribute("transform", f"translate({current_x}, {max_height * 0.8})")
            
            # Create SVG path pen to get the path data
            pen = SVGPathPen(glyph_set)
            glyph.draw(pen)
            path_data = pen.getCommands()
            
            # Create path element
            path = doc.createElement("path")
            path.setAttribute("d", path_data)
            path.setAttribute("fill", fill_color)
            path.setAttribute("transform", f"scale({scale_factor}, {-scale_factor})")
            
            # Add path to character group
            char_group.appendChild(path)
            
            # Add character group to SVG
            svg.appendChild(char_group)
            
            # Update position for next character
            try:
                current_x += glyph.width * scale_factor
            except AttributeError:
                current_x += font_size * 0.6  # Fallback width
    
    total_width = current_x if current_x > 0 else font_size * len(text) * 0.6
    
    # Set viewBox attribute based on calculated dimensions
    svg.setAttribute("viewBox", f"0 0 {total_width} {max_height}")
    svg.setAttribute("width", str(total_width))
    svg.setAttribute("height", str(max_height))
    
    # Convert to string and return
    svg_str = doc.toxml()
    doc.unlink()  # Clean up
    
    return svg_str

def optimize_svg(svg: str) -> str:
    """
    Optimize SVG by removing unnecessary whitespace and attributes.
    This is a basic optimization function that can be expanded.
    
    Args:
        svg: SVG as a string
        
    Returns:
        Optimized SVG as a string
    """
    # Parse the SVG
    doc = minidom.parseString(svg)
    
    # Serialize without extra whitespace
    lines = [line for line in doc.toprettyxml(indent='  ').split('\n') if line.strip()]
    return '\n'.join(lines)