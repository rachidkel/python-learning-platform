declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    if (!window.loadPyodide) {
      await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
    }
    if (!window.loadPyodide) {
      throw new Error("Pyodide script failed to load");
    }
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    pyodideInstance = pyodide;
    return pyodide;
  })();

  return loadingPromise;
}

export async function runPython(code: string): Promise<string> {
  const pyodide = await getPyodide();

  let output = "";

  pyodide.setStdout({
    batched: (str: string) => {
      output += str + "\n";
    },
  });

  pyodide.setStderr({
    batched: (str: string) => {
      output += "❌ " + str + "\n";
    },
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err: any) {
    output += "❌ " + (err.message || String(err));
  }

  return output.trim() || "(no output)";
}