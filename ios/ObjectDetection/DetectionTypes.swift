import Foundation

// MARK: - Standardized Output Types
struct DetectionBounds {
  let minX: Double
  let minY: Double
  let midX: Double
  let midY: Double
  let maxX: Double
  let maxY: Double
  let width: Double
  let height: Double
  let originX: Double
  let originY: Double
  
  init(minX: Double, minY: Double, midX: Double, midY: Double, maxX: Double, maxY: Double, width: Double, height: Double, originX: Double, originY: Double) {
    self.minX = minX
    self.minY = minY
    self.midX = midX
    self.midY = midY
    self.maxX = maxX
    self.maxY = maxY
    self.width = width
    self.height = height
    self.originX = originX
    self.originY = originY
  }
  
  var dictionary: [String: Any] {
    return [
      "minX": minX,
      "minY": minY,
      "midX": midX,
      "midY": midY,
      "maxX": maxX,
      "maxY": maxY,
      "width": width,
      "height": height,
      "originX": originX,
      "originY": originY
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