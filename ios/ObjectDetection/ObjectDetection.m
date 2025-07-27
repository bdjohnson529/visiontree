#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("visiontree/visiontree-Swift.h")
#import "visiontree/visiontree-Swift.h"
#else
#import "visiontree-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(ObjectDetectionPlugin, detectObjects)