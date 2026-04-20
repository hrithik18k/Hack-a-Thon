const fs = require('fs');
const path = require('path');
const dir = 'd:/project/Medi-Track/client/src';

const walkSync = (d) => {
  let files = [];
  fs.readdirSync(d).forEach(file => {
    const p = path.join(d, file);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walkSync(p));
    } else if (p.endsWith('.jsx')) {
      const content = fs.readFileSync(p, 'utf8');
      if (content.match(/const \w+ = \(\{.*\}\) =>/) || content.match(/function \w+\(\{.*\}\)/)) {
        files.push(p);
      }
    }
  });
  return files;
};

const components = walkSync(dir);
components.forEach(c => {
  let content = fs.readFileSync(c, 'utf8');
  if(!content.includes('PropTypes')) {
    const funcMatch = content.match(/const (\w+) = \(\{\s*([^}]+)\s*\}\) =>/);
    if (funcMatch) {
      const name = funcMatch[1];
      const propsStr = funcMatch[2];
      const props = propsStr.split(',').map(p => p.trim().split('=')[0].trim()).filter(p => !p.startsWith('...') && p !== '');
      if (props.length > 0) {
          const ptObj = props.map(p => "  " + p + ": PropTypes.any").join(',\n');
          const ptCode = "\n" + name + ".propTypes = {\n" + ptObj + "\n};\n";
          content = "import PropTypes from 'prop-types';\n" + content + ptCode;
          fs.writeFileSync(c, content);
          console.log('Added prop-types to ' + c);
      }
    }
  }
});
