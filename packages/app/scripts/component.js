const fs = require('fs');
const path = require('path');

const [, , type = 'components', componentName_] = process.argv;

const componentName = componentName_.replace(/^\w/, function(chr) {
  return chr.toUpperCase();
});

const dir = path.join(__dirname, `../src`, type);

const write = (path, content) => {
  fs.writeFileSync(
    path,
    content.replace(/^ {2}/gm, '').replace(/^ *\n/, ''),
    'utf-8'
  );
};

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const reactComponent = `
import React from 'react';
  import { StyleSheet, View } from 'react-native';

  const styles = StyleSheet.create({});

  export function ${componentName}() {
    return (
      <View>
      </View>
    );
  }
  `;

write(`${dir}/${componentName}.tsx`, reactComponent);
