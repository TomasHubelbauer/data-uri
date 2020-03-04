window.addEventListener('load', async () => {
  /** @type {HTMLTextAreaElement} */
  const sourceTextArea = document.getElementById('sourceTextArea');

  /** @type {HTMLInputElement} */
  const fileInput = document.getElementById('fileInput');

  /** @type {HTMLButtonElement} */
  const clearButton = document.getElementById('clearButton');

  /** @type {HTMLSpanElement} */
  const creditSpan = document.getElementById('creditSpan');

  /** @type {HTMLTextAreaElement} */
  const resultTextArea = document.getElementById('resultTextArea');

  /** @type {HTMLInputElement} */
  const typeInput = document.getElementById('typeInput');

  /** @type {HTMLSelectElement} */
  const charsetSelect = document.getElementById('charsetSelect');

  /** @type {HTMLInputElement} */
  const strideInput = document.getElementById('strideInput');

  /** @type {HTMLInputElement} */
  const hugInput = document.getElementById('hugInput');

  // Prevent the browser from recovering the last selected file
  fileInput.value = '';

  sourceTextArea.addEventListener('input', go);
  fileInput.addEventListener('change', go);
  typeInput.addEventListener('input', go);
  charsetSelect.addEventListener('change', go);
  strideInput.addEventListener('input', go);
  hugInput.addEventListener('input', go);
  clearButton.addEventListener('click', () => {
    fileInput.value = '';
    go();
  });

  function go() {
    // Hide the credit the moment the user changes the demo source value
    creditSpan.style.display = 'none';

    if (fileInput.files.length > 0) {
      if (fileInput.files.length > 1) {
        alert('Multiple files are not supported, taking the first file.');
      }

      const file = fileInput.files[0];

      clearButton.disabled = false;
      sourceTextArea.value = '';
      sourceTextArea.disabled = true;
      typeInput.value = file.type;
      typeInput.disabled = true;
      charsetSelect.value = 'base64';
      charsetSelect.disabled = true;

      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => goResult(fileReader.result));
      fileReader.addEventListener('error', () => alert('Failed to load the file.'));
      fileReader.readAsDataURL(file);
      return;
    }

    clearButton.disabled = true;
    sourceTextArea.disabled = false;
    typeInput.disabled = false;
    charsetSelect.disabled = false;

    let result = 'data:';
    result += typeInput.value;
    if (charsetSelect.value) {
      result += ';' + charsetSelect.value;
    }

    if (charsetSelect.value === 'base64') {
      result += ',' + btoa(sourceTextArea.value);
    }
    else {
      result += ',' + sourceTextArea.value;
    }

    goResult(result);
  }

  function goResult(result) {
    let lines = [result];
    if (strideInput.value) {
      lines = result.match(new RegExp(`.{0,${strideInput.valueAsNumber}}`, 'g'));
    }

    result = hugInput.checked
      ? lines.map(l => `'${l}',`).join('\n')
      : lines.join('\n');

    resultTextArea.value = result;
  }

  const response = await fetch('index.svg');
  const text = await response.text();
  sourceTextArea.value = text;

  go();
});
