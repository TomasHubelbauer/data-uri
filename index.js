window.addEventListener('load', async () => {
  /** @type {HTMLTextAreaElement} */
  const sourceTextArea = document.getElementById('sourceTextArea');

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

  sourceTextArea.addEventListener('input', go);
  typeInput.addEventListener('input', go);
  charsetSelect.addEventListener('change', go);
  strideInput.addEventListener('input', go);
  hugInput.addEventListener('input', go);

  function go() {
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
