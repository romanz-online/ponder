# Ponder Extension

A Visual Studio Code extension for Flutter/Dart developers that provides quick widget previews and detailed demos through special code comments.

## Features

- **Quick Hover Previews**: Hover over `@ponder` comments to see widget previews inline
- **Code Lens Integration**: Click "🤔 Ponder" buttons to open detailed demos
- **Local File Support**: Display local images from your project workspace
- **Multi-line Comment Format**: Clean, readable syntax for widget documentation

## Usage

Add ponder comments above your Flutter widget classes using this format:

```dart
/// @ponder
/// @preview [preview-url-or-path]
/// @detailed [detailed-demo-url]
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      // Your widget implementation
    );
  }
}
```

### Supported Formats

#### Web URLs

```dart
/// @ponder
/// @preview https://example.com/widget-preview.gif
/// @detailed https://example.com/full-demo
class WebWidget extends StatelessWidget { ... }
```

#### Local Files

```dart
/// @ponder
/// @preview assets/images/widget-preview.png
/// @detailed https://example.com/demo
class LocalPreviewWidget extends StatelessWidget { ... }
```

#### Preview Only

```dart
/// @ponder
/// @preview https://example.com/demo.gif
class PreviewOnlyWidget extends StatelessWidget { ... }
```

#### Detailed Only

```dart
/// @ponder
/// @detailed https://example.com/detailed-demo
class DetailedOnlyWidget extends StatelessWidget { ... }
```

## How It Works

1. **Hover Preview**: When you hover over any line in a ponder comment block, you'll see an inline preview of the widget
2. **Code Lens**: A "🤔 Ponder" button appears above the comment block - click it to open the detailed demo in your browser
3. **Local Files**: Relative file paths are automatically resolved to your workspace root

## Configuration

The extension provides the following configuration options:

- `ponderWidget.hoverPreviewSize`: Size of hover preview images in pixels (default: 200)

To configure, add to your VS Code settings:

```json
{
  "ponderWidget.hoverPreviewSize": 300
}
```

## Requirements

- Visual Studio Code 1.74.0 or higher
- Dart language support (automatic when working with Flutter/Dart projects)

## File Types

This extension is activated for:

- `.dart` files

## Installation

1. Install the extension in VS Code
2. Open a Dart/Flutter project
3. Add ponder comments to your widget classes
4. Hover over the comments to see previews
5. Click the code lens buttons to open detailed demos

## Examples

### Basic Widget with Preview and Demo

```dart
/// @ponder
/// @preview https://media.giphy.com/media/example/widget-demo.gif
/// @detailed https://flutter-examples.com/my-widget-demo
class AnimatedButton extends StatefulWidget {
  // Widget implementation...
}
```

### Local Asset Preview

```dart
/// @ponder
/// @preview docs/screenshots/custom-slider.png
class CustomSlider extends StatelessWidget {
  // Widget implementation...
}
```

## Tips

- Use GIFs for animated widget previews
- Keep preview images reasonably sized for quick loading
- Local file paths are relative to your workspace root
- Both `@preview` and `@detailed` are optional, but you need at least one
- The order of `@preview` and `@detailed` doesn't matter

## Troubleshooting

### Images not showing in hover preview

- Ensure the URL is accessible or the local file exists
- Check that the file path is relative to your workspace root
- Try adjusting the `hoverPreviewSize` setting if images appear too large/small

### Code lens not appearing

- Make sure your comment starts with `/// @ponder` (three slashes)
- Ensure the file is saved with a `.dart` extension
- Check that VS Code recognizes the file as Dart language

## Contributing

This extension is part of a larger Flutter development toolkit. Contributions and feedback are welcome!

## License

[Add your license information here]

---

**Enjoy pondering your widgets!** 🤔
