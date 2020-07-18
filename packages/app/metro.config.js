const { createMetroConfiguration } = require('expo-yarn-workspaces');
// const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  // const {
  //   resolver: { sourceExts, assetExts }
  // } = await getDefaultConfig();

  return {
    ...createMetroConfiguration(__dirname)
    // transformer: {
    //   babelTransformerPath: require.resolve('react-native-svg-transformer')
    // },
    // resolver: {
    //   assetExts: assetExts.filter(ext => ext !== 'svg'),
    //   sourceExts: [...sourceExts, 'svg']
    // }
  };
})();
