import ExpoModulesCore
import UIKit
import CoreGraphics

public class MyModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MyModule')` in JavaScript.
    Name("MyModule")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello from MyModule.swift! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Native Swift functions
    Function("getNativeGreeting") { (name: String) in
      return "Hello from native Swift, \(name)!"
    }

    Function("getDeviceInfo") {
      let device = UIDevice.current
      let screen = UIScreen.main.bounds
      
      return [
        "name": device.name,
        "model": device.model,
        "systemName": device.systemName,
        "systemVersion": device.systemVersion,
        "screenWidth": screen.size.width,
        "screenHeight": screen.size.height
      ]
    }

    AsyncFunction("processImage") { (imageUri: String) -> [String: Any] in
      guard let url = URL(string: imageUri),
            let data = try? Data(contentsOf: url),
            let image = UIImage(data: data),
            let cgImage = image.cgImage else {
        return ["error": "Failed to load image"]
      }
      
      let width = cgImage.width
      let height = cgImage.height
      let hasAlpha = cgImage.alphaInfo != .none
      let bitsPerComponent = cgImage.bitsPerComponent
      let bitsPerPixel = cgImage.bitsPerPixel
      
      let result = [[
        "width": width,
        "height": height,
        "hasAlpha": hasAlpha,
        "bitsPerComponent": bitsPerComponent,
        "bitsPerPixel": bitsPerPixel
      ]]
      
      return ["data": result]
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(MyModuleView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: MyModuleView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
