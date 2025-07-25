interface TreeAnalysisResult {
  vegetationCoverage: number;
  treeCount: number;
  treeRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  frameWidth: number;
  frameHeight: number;
  timestamp: number;
}

declare global {
  function __analyzeTree(frame: any): TreeAnalysisResult;
}