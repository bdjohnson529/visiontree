import { Frame, VisionCameraProxy } from 'react-native-vision-camera'

const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectObjects', {})

/**
 * Detects objects.
 */

export function detectObjects(frame: Frame): object {
  'worklet'
  if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "detectObjects"!')

  return plugin.call(frame) as object
}