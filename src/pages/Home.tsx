import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';

export default function Home() {
  const navigate = useNavigate();

  const handleCreate = async () => {
    const docRef = await addDoc(collection(db, 'canvases'), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      data: null,
    });
    navigate(`/canvas/${docRef.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-indigo-50/30">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white grid place-items-center shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight">Canvas2D</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Free & Open Source
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Design on a{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              simple canvas
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10">
            Create, edit, and save beautiful canvases with an intuitive drawing editor. 
            No sign-up required. Your work is saved instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleCreate}
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-black text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Canvas
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </button>
            
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 text-lg font-semibold border border-gray-300 shadow-sm hover:shadow transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Preview Cards */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-200 to-purple-200 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative grid md:grid-cols-3 gap-4">
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Draw Shapes</h3>
                <p className="text-gray-600 text-sm">Rectangles, circles, text, and freehand drawing tools</p>
              </div>

              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Auto Save</h3>
                <p className="text-gray-600 text-sm">Your work is securely saved to the cloud instantly</p>
              </div>

              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Share Anywhere</h3>
                <p className="text-gray-600 text-sm">Get a unique URL to access your canvas from any device</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A powerful yet simple canvas editor built with modern web technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 mb-4">
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Drawing</h3>
              <p className="text-gray-600 text-sm">Intuitive tools for shapes and freehand drawing</p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Color Picker</h3>
              <p className="text-gray-600 text-sm">Customize fill and stroke colors instantly</p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Responsive</h3>
              <p className="text-gray-600 text-sm">Works beautifully on all screen sizes</p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Built with React and Vite for optimal performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with modern technology
            </h2>
            <p className="text-lg text-gray-600">
              Powered by React 19, Fabric.js, and Firebase
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl">⚛️</div>
              <div className="font-semibold">React 19</div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl">⚡</div>
              <div className="font-semibold">Vite</div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl">🎨</div>
              <div className="font-semibold">Fabric.js</div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl">🔥</div>
              <div className="font-semibold">Firebase</div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl">💨</div>
              <div className="font-semibold">Tailwind CSS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 text-white grid place-items-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <div className="font-bold">Canvas2D</div>
                <div className="text-xs text-gray-500">Simple & Powerful Drawing</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 Canvas2D. No sign-in required.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


