import React, { useState } from 'react';
import { Wand, AlertTriangle, CheckCircle, Download, Instagram, Linkedin, Github, Store } from 'lucide-react';
import '@fontsource/roboto';
import '@fontsource/open-sans';
import '@fontsource/lato';

const fonts = [
  // Arial Family
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Arial Bold', family: 'Arial, sans-serif' },
  { name: 'Arial Italic', family: 'Arial, sans-serif' },
  { name: 'Arial Bold Italic', family: 'Arial, sans-serif' },
  { name: 'Arial Black', family: 'Arial Black, sans-serif' },

  // Arial Narrow Family
  { name: 'Arial Narrow', family: 'Arial Narrow, sans-serif' },
  { name: 'Arial Narrow Bold', family: 'Arial Narrow, sans-serif' },
  { name: 'Arial Narrow Bold Italic', family: 'Arial Narrow, sans-serif' },
  { name: 'Arial Narrow Italic', family: 'Arial Narrow, sans-serif' },

  // Times Family
  { name: 'Times New Roman', family: 'Times New Roman, serif' },
  { name: 'Times Bold', family: 'Times New Roman, serif' },
  { name: 'Times Bold Italic', family: 'Times New Roman, serif' },
  { name: 'Times Italic', family: 'Times New Roman, serif' },

  // Google Fonts
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Open Sans', family: 'Open Sans, sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Poppins', family: 'Poppins, sans-serif' },

  // Script Fonts
  { name: 'Brush Script MT', family: 'Brush Script MT, cursive' },
  { name: 'Freestyle Script', family: 'Freestyle Script, cursive' },
  { name: 'Mistral', family: 'Mistral, cursive' },
  { name: 'Segoe Script', family: 'Segoe Script, cursive' },
  { name: 'Segoe Print', family: 'Segoe Print, cursive' },
  { name: 'Ink Free', family: 'Ink Free, cursive' },
  { name: 'Matura MT Script', family: 'Matura MT Script Capitals, cursive' },
  { name: 'Lucida Handwriting', family: 'Lucida Handwriting, cursive' },

  // Monospace Family
  { name: 'Courier New', family: 'Courier New, monospace' },
  { name: 'Courier New Bold', family: 'Courier New, monospace' },
  { name: 'Courier New Italic', family: 'Courier New, monospace' },
  { name: 'Courier New Bold Italic', family: 'Courier New, monospace' },

  // Decorative Fonts
  { name: 'Showcard Gothic', family: 'Showcard Gothic, fantasy' },
  { name: 'Agency FB', family: 'Agency FB, sans-serif' },
  { name: 'Agency FB Bold', family: 'Agency FB, sans-serif' },
  { name: 'Harlow Solid Italic', family: 'Harlow Solid Italic, cursive' },

  // System Fonts
  { name: 'Helvetica', family: 'Helvetica, sans-serif' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Tahoma', family: 'Tahoma, sans-serif' },
  { name: 'Trebuchet MS', family: 'Trebuchet MS, sans-serif' },

  // Variant Fonts
  { name: 'Verdana Bold', family: 'Verdana, sans-serif' },
  { name: 'Verdana Italic', family: 'Verdana, sans-serif' },
  { name: 'Georgia Bold', family: 'Georgia, serif' },
  { name: 'Georgia Italic', family: 'Georgia, serif' }
];

function App() {
  const [text, setText] = useState('Aaroophan');
  const [fontSize, setFontSize] = useState(56);
  const [fillColor, setFillColor] = useState('#00357a');
  const [selectedFont, setSelectedFont] = useState(fonts[20]);
  const [svgResult, setSvgResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [svgCode, setSvgCode] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSvgResult(null);

    let apiUrl: String;
    apiUrl = 'https://svg-ify-api.onrender.com';
    //apiUrl = 'http://127.0.0.1:8000';

    try {
      const response = await fetch(''+apiUrl+'/text-to-path', {
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
      setSvgCode(data.svg);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSvgCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setSvgCode(newCode);
    try {
      // Create a temporary div to parse the SVG
      const temp = document.createElement('div');
      temp.innerHTML = newCode;
      const svg = temp.querySelector('svg');
      
      if (svg) {
        setSvgResult(newCode);
        setError(null);
      } else {
        setError('Invalid SVG code');
      }
    } catch (err) {
      setError('Invalid SVG code');
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
    <div className="min-h-screen bg-gradient-to-br from-sky-300 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <br/><br/>
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SVG-ify</h1>
          <p className="text-blue-900">Convert text to SVG with individual path elements for each character component</p>
        </header>

        <div className="bg-gradient-to-br from-sky-200 to-blue-200 rounded-xl shadow-3xl overflow-hidden max-w-4xl mx-auto">
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
                  className="w-full px-5 py-2 border text-3xl border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 bg-gradient-to-br from-sky-400 to-blue-700"
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
                        <Wand className="mr-2 h-4 w-4" />
                      Generate SVG
                    </>
                  )}
                </button>
              </div>
            </form>

            {loading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Converting text to SVG...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            {success && svgResult && (
              <div className="mt-6 space-y-6">
                <hr className="bg-gradient-to-br from-sky-900 to-blue-900" />
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">SVG Preview</h3>
                  <div className="flex justify-center items-center min-h-[200px] bg-white rounded-md p-4">
                    <div dangerouslySetInnerHTML={{ __html: svgResult }} />
                  </div>
                  <button
                    onClick={downloadSvg}
                    className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gradient-to-br from-sky-400 to-blue-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download SVG
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">SVG Code</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(svgCode);
                          // You might want to add a toast notification here
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          try {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(svgCode, 'text/xml');
                            const serializer = new XMLSerializer();
                            const formatted = serializer.serializeToString(xmlDoc)
                              .replace(/></g, '>\n<')
                              .replace(/(<[^>]+>)/g, (match) => {
                                return match.replace(/\s+/g, ' ').trim();
                              });
                            setSvgCode(formatted);
                          } catch (err) {
                            setError('Invalid SVG code');
                          }
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                      >
                        Format
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={svgCode}
                      onChange={handleSvgCodeChange}
                      className="w-full font-mono text-sm p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-gray-100"
                      spellCheck="false"
                      style={{
                        tabSize: 2,
                        lineHeight: '1.5',
                        letterSpacing: '0.025em',
                        minHeight: '200px',
                        height: 'auto',
                        resize: 'vertical',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                    <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">
                      {svgCode.length} characters
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Tips:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Edit the SVG code to customize the output</li>
                      <li>Use the Format button to prettify the code</li>
                      <li>Changes are reflected in real-time in the preview</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="bg-transparent text-blue-900 py-6">
          <br /><br />
          <div className="container mx-auto px-4">
            <hr className="border-blue-300 mb-4" />
            <div className="text-center">
              <a
                href="https://aaroophan.onrender.com"
                className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-50 transition-colors duration-200"
              >
                &copy; 2025
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocKNRvtI3cvci9DHfzBfC3d0PgPneG86fZv7w5se1U5mfBgcNqXj4g=s83-c-mo"
                  alt="Aaroophan"
                  className="h-5 w-5 rounded-full"
                />
                Aaroophan
              </a>

              <ul className="flex justify-center gap-4 mt-4">
                <li>
                  <a
                    href="http://aaroophan.onrender.com"
                    aria-label="Portfolio"
                    className="hover:text-blue-50 transition-colors duration-200"
                  >
                    <Store size={15} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/aaroophan/?theme=dark"
                    aria-label="Instagram"
                    className="hover:text-blue-50 transition-colors duration-200"
                  >
                    <Instagram size={15} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/aaroophan"
                    aria-label="LinkedIn"
                    className="hover:text-blue-50 transition-colors duration-200"
                  >
                    <Linkedin size={15} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Aaroophan"
                    aria-label="GitHub"
                    className="hover:text-blue-50 transition-colors duration-200"
                  >
                    <Github size={15} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;