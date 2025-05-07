from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
from pathlib import Path

project_root = str(Path(__file__).parent.parent)
if project_root not in sys.path:
    sys.path.append(project_root)

from server.models import TextRequest, SVGResponse
from server.svg_generator import generate_svg

app = FastAPI(
    title="Text-to-Multi-Path SVG API",
    description="Convert text to SVG with individual path elements for each character component",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.post("/text-to-path", response_model=SVGResponse)
@app.options("/text-to-path", include_in_schema=False)
async def text_to_path(request: TextRequest):
    print("request")
    print(request)
    try:
        svg_content = generate_svg(
            text=request.text,
            font_family=request.font_family,
            font_size=request.font_size,
            fill_color=request.fill_color
        )
        
        return {"svg": svg_content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Text-to-Multi-Path SVG API",
        "description": "Convert text to SVG with individual path elements for each character component",
        "endpoints": {
            "/text-to-path": "POST - Convert text to SVG paths",
            "/docs": "GET - API documentation"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("server.main:app", host="0.0.0.0", port=port, reload=True)