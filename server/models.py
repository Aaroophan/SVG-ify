from pydantic import BaseModel, validator
import re

class TextRequest(BaseModel):
    text: str
    font_size: int = 40
    fill_color: str = "#000000"
    font_family: str

    @validator('text')
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Text cannot be empty')
        return v

    @validator('font_size')
    def font_size_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Font size must be positive')
        if v > 1000:
            raise ValueError('Font size must be less than or equal to 1000')
        return v

    @validator('fill_color')
    def validate_color(cls, v):
        if not re.match(r'^#(?:[0-9a-fA-F]{3}){1,2}$', v):
            raise ValueError('Fill color must be a valid hex color code (e.g., #000000)')
        return v

    @validator('font_family')
    def validate_font_family(cls, v):
        if not v:
            raise ValueError('Font family cannot be empty')
        return v

class SVGResponse(BaseModel):
    svg: str