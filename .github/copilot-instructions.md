# AutoFashion Reborn - AI Coding Agent Instructions

## Project Overview
AutoFashion Reborn is a 3D apparel customization web app built with React, Three.js (via react-three-fiber), and Tailwind CSS. Users can select clothing models (t-shirt/hoodie), customize colors, upload designs, and position/crop images on 3D models in real-time.

## Architecture & Key Components

### Core Stack
- **Frontend**: React 18 + Vite (no routing, single-page app)
- **3D Rendering**: `@react-three/fiber` + `@react-three/drei` + Three.js
- **UI**: shadcn/ui components (Radix UI primitives) + Tailwind CSS + Lucide React icons
- **Build Tool**: Vite with `@/` alias pointing to `src/`

### Component Hierarchy
```
App.jsx (minimal wrapper)
└── EditPage.jsx (main orchestrator)
    ├── Canvas (Three.js scene)
    │   ├── Model (base apparel with color/opacity)
    │   └── ModelImageFront (user design overlay with clipping)
    ├── ModelSelector.jsx (card-based apparel selector)
    ├── ColorPicker.jsx (color selection with react-color)
    ├── ImageUploader.jsx (drag-drop upload with preview)
    ├── PositionControls.jsx (visual + arrow key positioning)
    └── CropControls.jsx (4-direction crop sliders)
```

## Critical Patterns & Conventions

### Component Architecture
- **Modular controls**: Each feature (model selection, upload, crop, position, color) is a standalone component in `src/components/`
- **Prop callbacks**: Parent `EditPage.jsx` owns all state, components receive `onChange` handlers (e.g., `onModelChange`, `onCropChange`)
- **Disabled states**: Control components show disabled UI when `userImage` is null (crop/position require uploaded image)
- **useCallback optimization**: All state setters in `EditPage.jsx` use `useCallback` to prevent unnecessary re-renders

### 3D Model Management
- **Models are preloaded** in `EditPage.jsx` using `useGLTF.preload(model)` at module level
- **Dual-layer rendering**: Base model (`Model`) + overlay model (`ModelImageFront`) for user designs
- **Material handling**: Always use `MeshPhysicalMaterial` with `DoubleSide` to avoid transparency issues
- **GLB files** stored in `src/assets/` and imported via `@/assets/` alias (Vite config includes `.glb` in `assetsInclude`)
- **Model arrays**: `models` array for base GLBs, `overlayModels` array for design overlays (indexed by modelSelect)

### Texture & Image Manipulation
- **Texture positioning**: Controlled via `THREE.Texture.offset` (modified by arrow keys or button controls)
- **Cropping**: Uses texture `repeat` and `offset` for true image cropping (not clipping planes)
  - Crop values are normalized 0-1 (0 = no crop, 1 = fully cropped)
  - `repeat` zooms into the texture: `repeatX = 1 / (1 - horizontalCrop)`
  - `offset` shifts the visible portion to account for asymmetric crops
  - Displayed as percentages in UI for better UX
- **User uploads**: Handled via FileReader API, converted to data URLs for texture loading
- **Drag-drop support**: `ImageUploader` component handles both file input and drag-drop events
- **Rotation caveat**: Texture rotation set to `Math.PI` (inverted) - adjust designs accordingly

### State Management Strategy
- **Centralized state**: All state lives in `EditPage.jsx` (color, model selection, crop values, image data, position)
- **State resets**: Model changes reset position; new image uploads reset position AND crop values
- **Functional updates**: Position changes use functional setState to avoid closure issues with arrow keys
- **Arrow key controls**: Implemented via `arrow-keys-react` library, attached to controls section div with `tabIndex={0}`

### UI Component System (shadcn/ui)
- **Location**: UI primitives in `src/components/ui/`, feature components in `src/components/`
- **Customization**: Do NOT edit primitive components; compose them in feature components
- **Styling**: Tailwind classes via `className` prop; `cn()` utility in `src/lib/utils.js` merges classes
- **Icons**: Lucide React for all icons (`Upload`, `Crop`, `Move`, `Palette`, `X`, etc.)
- **Configuration**: `components.json` defines paths and styles (non-TSX, no RSC)

## Development Workflows

### Running the App
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Adding New 3D Models
1. Place `.glb` file in `src/assets/`
2. Import in `EditPage.jsx`: `import newModel from "@/assets/new-model.glb"`
3. Add to `models` array and create corresponding overlay model
4. Update `ModelSelector.jsx` with new icon/name in `models` array

### Adding New Control Components
```jsx
// Pattern for new control components:
export function NewControl({ value, onChange, disabled }) {
  if (disabled) {
    return <DisabledUI />; // Show why disabled
  }
  return (
    <Card>
      <CardContent>
        <YourControlUI />
      </CardContent>
    </Card>
  );
}
```

### Debugging 3D Issues
- **Texture not showing**: Check texture is loaded and material map is set correctly in `ModelImageFront`
- **Cropping not working**: Verify crop values are in 0-1 range and repeat/offset calculations are correct
- **Model color issues**: Ensure `scene.traverse()` updates all mesh children
- **HMR issues**: Vite HMR works well but full page refresh may be needed after GLB changes

## External Dependencies & Integration

### Three.js Ecosystem
- **Loader**: `useGLTF` hook from `@react-three/drei` handles GLB loading
- **Controls**: `OrbitControls` enables camera rotation/zoom
- **Lighting**: Ambient + point + directional + hemisphere lights (optimized colors in EditPage)

### UI Libraries
- **react-color**: `CirclePicker` with predefined color palette (20 colors)
- **lucide-react**: Modern icon library (tree-shakeable, replaces old icon images)
- **arrow-keys-react**: Keyboard control binding (attached to controls section, not global)

### Image Processing
- **No backend**: All image handling is client-side via FileReader
- **No optimization**: Uploaded images used as-is (consider adding compression for large files)
- **File validation**: `ImageUploader` checks `file.type.startsWith("image/")`

## Common Pitfalls

1. **Don't modify UI primitives** (`button.jsx`, `slider.jsx`, etc.) - create wrapper components instead
2. **GLB imports require Vite config**: `assetsInclude: ['**/*.glb']` already configured
3. **Arrow key scope**: Arrow keys only work when controls section is focused (intentional UX)
4. **State reset timing**: New image upload resets position/crop; model change only resets position
5. **useCallback dependencies**: Keep dependency arrays accurate to avoid stale closures
6. **Component file location**: Feature components go in `src/components/`, UI primitives in `src/components/ui/`

## Project-Specific Notes

- **Responsive design**: Uses Tailwind's responsive classes (`lg:flex-row`, `lg:w-1/2`) for mobile/desktop
- **No backend/API**: Entirely client-side application (could add save/export functionality)
- **ESLint configured**: Run `npm run lint` before commits
- **Deployment**: Optimized for Vercel
- **Browser compatibility**: Requires WebGL support (Three.js requirement)
- **Accessibility**: Controls section is keyboard navigable; consider adding ARIA labels for screen readers
