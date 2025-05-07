# Text-to-Multi-Path SVG Converter

This project provides a FastAPI-based API that converts text into SVG with individual path elements for each character component.

## Features

- FastAPI endpoint for text-to-SVG conversion
- Granular SVG paths for each character component
- TTF/OTF font support via base64 encoding
- Proper character spacing and alignment
- React-based UI for easy testing and visualization

## Project Structure

```
/
├── src/                # React frontend
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind CSS styles
│
├── server/             # FastAPI backend
│   ├── main.py         # FastAPI application entry point
│   ├── models.py       # Pydantic models for request/response
│   ├── font_parser.py  # Font parsing logic
│   └── svg_generator.py # SVG generation logic
│
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the FastAPI backend:

```bash
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Start the React frontend:

```bash
npm run dev
```

3. Open your browser and navigate to `https://aaroophan.github.io/SVG-ify`

## API Usage

### Endpoint

```
POST /text-to-path
```

### Request Body

```json
{
  "text": "Hello",
  "font_size": 40,
  "fill_color": "#000000",
  "font_data": "base64EncodedTTF/OTF"
}
```

### Response

```json
{
  "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 80\">...</svg>"
}
```

## License

MIT