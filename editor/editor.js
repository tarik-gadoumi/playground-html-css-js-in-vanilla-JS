// import prettier from 'https://unpkg.com/prettier@2.7.1/esm/standalone.mjs';
// import parserBabel from 'https://unpkg.com/prettier@2.7.1/esm/parser-babel.mjs';
// import parserHtml from 'https://unpkg.com/prettier@2.7.1/esm/parser-html.mjs';
// import parserCss from 'https://unpkg.com/prettier@2.7.1/esm/parser-postcss.mjs';
import prettier from '../prettier.js';
import parserBabel from '../parserBabel.js';
import parserHtml from '../parserHtml.js';
import parserCss from '../parserPostCss.js';
// import hljs from '../highlight/es/highlight.js';
// import hljsGrammar from '../highlight/es/languages/xml.min.js';
// window.addEventListener('DOMContentLoaded', () => {
const getEl = (id) => document.getElementById(id);

const iFrame = getEl('iFrame').contentWindow.document;
const htmlTextArea = getEl('htmlTextarea');
const cssTextArea = getEl('cssTextarea');
const jsTextArea = getEl('jsTextarea');

const codeFormat = (valeur, parser, plugins) => {
  let result = prettier.format(valeur, {
    parser: parser,
    plugins: plugins,
    tabWidth: 2,
    htmlWhitespaceSensitivity: 'ignore',
  });
  return result;
};

function reducerFormat({ language }) {
  switch (language) {
    case 'html':
      return (htmlTextArea.value = codeFormat(htmlTextArea.value, 'html', [
        parserHtml,
      ]));
    case 'css':
      return (cssTextArea.value = codeFormat(cssTextArea.value, 'css', [
        parserCss,
      ]));
    case 'js':
      return (jsTextArea.value = codeFormat(jsTextArea.value, 'babel', [
        parserBabel,
      ]));
  }
}

function writeln(type) {
  try {
    switch (type) {
      case 'format':
        let formatedHtml = reducerFormat({ language: 'html' });
        let formatedCss = reducerFormat({ language: 'css' });
        let formatedJS = reducerFormat({ language: 'js' });
        iFrame.writeln(
          formatedHtml +
            '<style>' +
            formatedCss +
            '</style>' +
            '<script type="module">' +
            formatedJS +
            '</script>'
        );
        break;
      case 'dontFormat':
        iFrame.writeln(
          htmlTextArea.value + '<style>' + cssTextArea.value + '</style>'
        );
        break;
    }
  } catch (e) {
    reportError(e);
    console.log(reportError(e));
  }
}

const run = ({ type }) => {
  iFrame.open();
  writeln(type);
  iFrame.close();
};
document.body.onkeyup = () => {
  run({ type: 'dontFormat' });
  return;
};
document.body.onkeydown = (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    run({ type: 'format' });
    return;
  }
};
//});
