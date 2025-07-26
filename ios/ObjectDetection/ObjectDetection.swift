import VisionCamera

@objc(ObjectDetectionPlugin)
public class ObjectDetectionPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    let buffer = frame.buffer
    let orientation = frame.orientation
    
    // Return placeholder detection results
    let placeholderResults: [String: Any] = [
      "objects": [
        [
          "label": "placeholder",
          "confidence": 0.85,
          "bounds": [
            "x": 100,
            "y": 100,
            "width": 200,
            "height": 150
          ]
        ]
      ],
      "frameWidth": 1,
      "frameHeight": 1
    ]
    
    return placeholderResults
  }
}