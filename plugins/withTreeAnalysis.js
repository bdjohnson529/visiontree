const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withTreeAnalysis = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      
      // Copy frame processor files to iOS project
      const sourceDir = path.join(projectRoot, 'plugins', 'ios');
      const targetDir = path.join(platformProjectRoot, 'visiontree');
      
      // Ensure target directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copy header file
      const headerSource = path.join(sourceDir, 'TreeAnalysisFrameProcessor.h');
      const headerTarget = path.join(targetDir, 'TreeAnalysisFrameProcessor.h');
      if (fs.existsSync(headerSource)) {
        fs.copyFileSync(headerSource, headerTarget);
      }
      
      // Copy implementation file
      const implSource = path.join(sourceDir, 'TreeAnalysisFrameProcessor.m');
      const implTarget = path.join(targetDir, 'TreeAnalysisFrameProcessor.m');
      if (fs.existsSync(implSource)) {
        fs.copyFileSync(implSource, implTarget);
      }
      
      // Copy registry file
      const registrySource = path.join(sourceDir, 'FrameProcessorPluginRegistry.m');
      const registryTarget = path.join(targetDir, 'FrameProcessorPluginRegistry.m');
      if (fs.existsSync(registrySource)) {
        fs.copyFileSync(registrySource, registryTarget);
      }
      
      return config;
    },
  ]);
};

module.exports = withTreeAnalysis;