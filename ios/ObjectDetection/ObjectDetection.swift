import VisionCamera
import MLKitObjectDetection
import MLKitVision

@objc(ObjectDetectionPlugin)
public class ObjectDetectionPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }
  
  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    // Convert frame buffer to VisionImage
    let buffer = frame.buffer
    let visionImage = VisionImage(buffer: buffer)
    //visionImage.orientation = frame.orientation
    
    // Live detection and tracking
    let options = ObjectDetectorOptions()
    options.shouldEnableClassification = true
    let objectDetector = ObjectDetector.objectDetector(options: options)
    
    do {
      let objects = try objectDetector.results(in: visionImage)
     
      // Return empty objects array if no objects detected
      guard !objects.isEmpty else {
        let emptyResult = DetectionResult(
          objects: [],
          frameWidth: frame.width,
          frameHeight: frame.height,
          orientation: frame.orientation.rawValue
        )
        return emptyResult.dictionary
      }
      
      // Main results
      let detectedObjects = objects.map { object in
        let bestLabel = object.labels.max { $0.confidence < $1.confidence }
        let bounds = DetectionBounds(
          minX: object.frame.minX,
          minY: object.frame.minY,
          midX: object.frame.midX,
          midY: object.frame.midY,
          maxX: object.frame.maxX,
          maxY: object.frame.maxY,
          width: object.frame.width,
          height: object.frame.height,
          originX: object.frame.origin.x,
          originY: object.frame.origin.y
        )
        return DetectedObject(
          label: bestLabel?.text ?? "unknown",
          confidence: bestLabel?.confidence ?? 0.0,
          bounds: bounds
        )
      }
      
      let formatDescription = CMSampleBufferGetFormatDescription(buffer)!
      let dimensions = CMVideoFormatDescriptionGetDimensions(formatDescription)
      let result = DetectionResult(
        objects: detectedObjects,
        frameWidth: Int(dimensions.width),
        frameHeight: Int(dimensions.height),
        orientation: frame.orientation.rawValue
      )
      return result.dictionary
    } catch {
      // Return empty objects array on error
      let emptyResult = DetectionResult(
        objects: [],
        frameWidth: frame.width,
        frameHeight: frame.height,
        orientation: frame.orientation.rawValue
      )
      return emptyResult.dictionary
    }
  }
}
