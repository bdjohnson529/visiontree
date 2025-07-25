#import <VisionCamera/FrameProcessorPluginRegistry.h>
#import "TreeAnalysisFrameProcessor.h"

@interface FrameProcessorPluginRegistry (FrameProcessorPlugins)
@end

@implementation FrameProcessorPluginRegistry (FrameProcessorPlugins)

+ (void)load {
    // Register the custom frame processor plugin
    [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"analyzeTree"
                                            withInitializer:^FrameProcessorPlugin* () {
        return [[TreeAnalysisFrameProcessor alloc] init];
    }];
}

@end