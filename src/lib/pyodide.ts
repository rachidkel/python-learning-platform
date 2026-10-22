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
    batched: (str: any) => {
      output += str + "\n";
    },
  });

  pyodide.setStderr({
    batched: (str: any) => {
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

// Run tests against user code and return pass/fail
export async function runTests(userCode: string, testsJson: string) {
  const tests = JSON.parse(testsJson);
  const pyodide = await getPyodide();
  let results = [];

  for (const test of tests) {
    let output = "";
    pyodide.setStdout({ batched: (str: any) => { output += str + "\n"; } });
    
    try {
      const finalCode = `${userCode}\n\n${test.testCode}`;
      await pyodide.runPythonAsync(finalCode);
      
      const passed = output.trim() === test.expectedOutput.trim();
      results.push({ passed, expected: test.expectedOutput, actual: output.trim() });
    } catch (err: any) {
      results.push({ passed: false, expected: test.expectedOutput, actual: `Error: ${err.message}` });
    }
  }
  
  return results;
}