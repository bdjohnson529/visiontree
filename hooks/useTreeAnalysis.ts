import { useCallback } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue, runOnJS } from 'react-native-reanimated';

interface TreeRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

interface TreeAnalysisResult {
  vegetationCoverage: number;
  treeCount: number;
  treeRegions: TreeRegion[];
  frameWidth: number;
  frameHeight: number;
  timestamp: number;
}

interface UseTreeAnalysisOptions {
  onAnalysisResult?: (result: TreeAnalysisResult) => void;
  analysisInterval?: number; // Process every N frames (default: 30)
}

export function useTreeAnalysis({ 
  onAnalysisResult, 
  analysisInterval = 30 
}: UseTreeAnalysisOptions = {}) {
  const frameCount = useSharedValue(0);

  const handleAnalysisResult = useCallback((result: TreeAnalysisResult) => {
    onAnalysisResult?.(result);
  }, [onAnalysisResult]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    frameCount.value += 1;
    
    // Only process every Nth frame for performance
    if (frameCount.value % analysisInterval !== 0) {
      return;
    }

    try {
      // Call the native frame processor
      const result = __analyzeTree(frame) as TreeAnalysisResult;
      
      // Run the callback on the JS thread
      if (result && onAnalysisResult) {
        runOnJS(handleAnalysisResult)(result);
      }
    } catch (error) {
      console.warn('Tree analysis failed:', error);
    }
  }, [handleAnalysisResult, analysisInterval]);

  return {
    frameProcessor,
    resetFrameCount: () => {
      frameCount.value = 0;
    }
  };
}