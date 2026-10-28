@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html, body {
  padding: 0;
  margin: 0;
  min-height: 100vh;
  background: #020817;
  color: #e2e8f0;
  font-family: Arial, Helvetica, sans-serif;
}

* { box-sizing: border-box; }

button, input, textarea, select {
  font: inherit;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 9999px;
}
