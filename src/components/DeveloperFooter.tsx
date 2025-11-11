import React, { useState } from 'react';
const lalityaImg = new URL('../assets/devs/lalitya.jpg', import.meta.url).href;
const puneethImg = new URL('../assets/devs/puneeth.jpg', import.meta.url).href;

const DeveloperFooter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const openPhoto = (src: string) => {
    setSelected(src);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      <footer className="w-full bg-gray-900 border-t border-gray-700 py-6 px-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Developed by</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Developer 1 */}
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition">
              <img src={lalityaImg} alt="Lalitya Dodla" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">Lalitya Dodla</p>
                <p className="text-xs text-gray-400">24BCE5289</p>
                <div className="mt-2">
                  <button
                    onClick={() => openPhoto(lalityaImg)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded"
                  >
                    Zoom Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition">
              <img src={puneethImg} alt="Puneeth Reddy T" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">Puneeth Reddy T</p>
                <p className="text-xs text-gray-400">24BCE5406</p>
                <div className="mt-2">
                  <button
                    onClick={() => openPhoto(puneethImg)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded"
                  >
                    Zoom Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            © 2025 RushGrid. Adaptive Multi-Agent Dynamic Routing Visualizer.
          </div>
        </div>
      </footer>

      {/* Modal for photo zoom */}
      {open && selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="bg-transparent rounded shadow-lg max-w-[90vw] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selected} alt="Developer" className="max-w-full max-h-[80vh] rounded" />
            <div className="mt-2 text-center">
              <button onClick={close} className="mt-2 bg-white text-black px-4 py-1 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperFooter;
