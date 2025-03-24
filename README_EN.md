# WebXR Virtual Art Gallery

[中文](README.md) | English

This is a virtual art gallery built with Three.js and WebXR technology, allowing users to browse artworks in a virtual reality environment.

## Features

- 3D virtual gallery environment with walls, floor, ceiling, and lighting
- WebXR support for VR headset experience
- Artwork display with frames and information panels
- Interactive controls supporting both VR controllers and traditional mouse/keyboard input
- Responsive design adapting to different screen sizes

## Tech Stack

- Three.js - 3D graphics library
- WebXR - Web Virtual Reality and Augmented Reality API
- Vite - Frontend build tool

## Installation and Running

### Prerequisites

- Node.js (v14.0.0 or higher)
- WebXR-compatible browser (latest versions of Chrome, Firefox, Edge)
- VR headset (optional, for VR experience)

### Installation Steps

1. Clone or download this repository
2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Visit the displayed URL in your browser (usually http://localhost:5173)

### Usage Instructions

#### Normal Mode
- Click and drag with left mouse button to rotate view
- Use mouse wheel to zoom
- Use W, A, S, D keys to move
- Press ESC to exit VR mode

#### VR Mode
- Click the VR button in the bottom right to enter VR mode
- Use VR controller touchpad/joystick to move
- Use controller buttons to interact

## Project Structure

```
.
├── js/                    # JavaScript source code
│   ├── artwork.js         # Artwork related logic
│   ├── controls.js        # Controls implementation
│   ├── gallery.js         # Gallery scene management
│   └── main.js            # Main program entry
├── index.html            # Main page
├── package.json          # Project configuration
└── vite.config.js        # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details