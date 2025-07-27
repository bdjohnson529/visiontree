import Foundation

// MARK: - Standardized Output Types
struct DetectionBounds {
  let x: Double
  let y: Double
  let width: Double
  let height: Double
  
  var dictionary: [String: Any] {
    return [
      "x": x,
      "y": y,
      "width": width,
      "height": height
    ]
  }
}

struct DetectedObject {
  let label: String
  let confidence: Float
  let bounds: DetectionBounds
  
  var dictionary: [String: Any] {
    return [
      "label": label,
      "confidence": confidence,
      "bounds": bounds.dictionary
    ]
  }
}

struct DetectionResult {
  let objects: [DetectedObject]
  let frameWidth: Int
  let frameHeight: Int
  let orientation: Int?
  
  var dictionary: [String: Any] {
    var result: [String: Any] = [
      "objects": objects.map { $0.dictionary },
      "frameWidth": frameWidth,
      "frameHeight": frameHeight
    ]
    
    if let orientation = orientation {
      result["orientation"] = orientation
    }
    
    return result
  }
}