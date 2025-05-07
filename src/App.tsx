import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import '@fontsource/roboto';
import '@fontsource/open-sans';
import '@fontsource/lato';

const fonts = [
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Helvetica', family: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', family: 'Times New Roman, serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Open Sans', family: 'Open Sans, sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif' },
];

function App() {
  const [text, setText] = useState('Hello');
  const [fontSize, setFontSize] = useState(40);
  const [fillColor, setFillColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [svgResult, setSvgResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSvgResult(null);

    try {
      const response = await fetch('http://SVG-ify-API.onrender.com/text-to-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          font_size: fontSize,
          fill_color: fillColor,
          font_family: selectedFont.family,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert text to SVG');
      }

      const data = await response.json();
      setSvgResult(data.svg);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSvg = () => {
    if (svgResult) {
      const blob = new Blob([svgResult], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${text.replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Text-to-Multi-Path SVG Converter</h1>
          <p className="text-gray-600">Convert text to SVG with individual path elements for each character component</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Text
                </label>
                <input
                  type="text"
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ fontFamily: selectedFont.family }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <input
                    type="number"
                    id="fontSize"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="fillColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Fill Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="fillColor"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-md mr-2"
                    />
                    <input
                      type="text"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="font" className="block text-sm font-medium text-gray-700 mb-1">
                    Font Family
                  </label>
                  <select
                    id="font"
                    value={selectedFont.name}
                    onChange={(e) => setSelectedFont(fonts.find(f => f.name === e.target.value) || fonts[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ fontFamily: selectedFont.family }}
                  >
                    {fonts.map(font => (
                      <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Generate SVG
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div className="text-sm text-green-700">SVG generated successfully!</div>
              </div>
            )}

            {svgResult && (
              <div className="mt-6 border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">SVG Result</h3>
                  <button
                    onClick={downloadSvg}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download SVG
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-center min-h-[200px]">
                    <div dangerouslySetInnerHTML={{ __html: svgResult }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Text-to-SVG Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;