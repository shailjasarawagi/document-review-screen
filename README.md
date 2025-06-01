# Document Review Interface

A comprehensive React-based document review interface for extracting and confirming data from documents with interactive field highlighting and validation.

## Features

### Core Functionality

- **Multi-Page Document Support**: Navigate through multiple pages with pagination controls
- **Document Viewer**: Interactive document display with zoom controls (75% to 200%)
- **Field Highlighting**: Dynamic highlighting of document areas based on extracted field positions
- **Right Sidebar**: Lists all extracted fields with checkboxes, badges, and field information
- **Interactive Selection**: Click or hover to highlight fields in both document and sidebar
- **Field Management**: Remove fields with dropdown menu options
- **Confirmation Workflow**: Modal-based confirmation process with success feedback

### Advanced Features

- **Dark Mode**: Sleek dark interface for reduced eye strain
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + A`: Select all fields
  - `Ctrl/Cmd + Enter`: Confirm selection
  - `Arrow Keys`: Navigate through fields
  - `+/-`: Zoom in/out
  - `F`: Toggle fullscreen
- **Responsive Design**: Optimized for desktop usage
- **TypeScript Support**: Full type safety throughout the application
- **Dynamic Field Badges**: Color-coded badges with field initials
- **Performance Optimizations**: Virtualized lists, memoization, and efficient rendering

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **Virtualization**: react-window for efficient list rendering
- **Performance**: CSS transforms, and optimized rendering

## Data Structure

The application works with three main data sources:

1. **pages.json**: Document page information and image URLs
2. **sections.json**: Extracted field data with positions and metadata
3. **bboxes.json**: Bounding box coordinates for field highlighting

## Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd document-review-screen
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## Usage

### Basic Workflow

1. **Document Loading**: The interface loads the document image and field data automatically
2. **Page Navigation**: Navigate through multiple pages using the pagination controls
3. **Field Review**: Review extracted fields in the right sidebar
4. **Selection**: Use checkboxes or click fields to select them for confirmation
5. **Highlighting**: Hover over fields to see corresponding areas highlighted in the document
6. **Confirmation**: Click "Confirm" to process selected fields
7. **Success**: Receive confirmation of successful processing

### Keyboard Navigation

- Use arrow keys to navigate through fields
- Press space to select/deselect the current field
- Use Ctrl/Cmd + A to select all fields
- Press Ctrl/Cmd + Enter to confirm selection
- Use +/- keys to zoom in/out
- Press F to toggle fullscreen mode

### Field Management

- Click the three-dot menu next to any field to access options
- Remove unwanted fields using the "Remove" option
- Fields are dynamically updated in both sidebar and document view

## Performance Insights

### Google Lighthouse Results

To run Google Lighthouse and generate performance insights:

1. **Local Development**:

   - Open Chrome DevTools (F12 or Right-click > Inspect)
   - Go to the "Lighthouse" tab
   - Select categories to audit (Performance, Accessibility, Best Practices, SEO)
   - Click "Generate report"

### Lighthouse Results Screenshot

![Lighthouse Performance Results](./public/assets/lighthouse.jpg)

### Key Performance Metrics

- **First Contentful Paint (FCP)**: Time until the first content is rendered
- **Largest Contentful Paint (LCP)**: Time until the largest content element is rendered
- **Total Blocking Time (TBT)**: Sum of all time periods between FCP and Time to Interactive
- **Cumulative Layout Shift (CLS)**: Measures visual stability
- **Speed Index**: How quickly content is visually displayed during page load

## Performance Optimizations

The application includes several performance optimizations:

1. **Virtualized Lists**: Only renders visible items in the field list
2. **Memoization**: Uses React.memo, useMemo, and useCallback to prevent unnecessary re-renders
3. **Efficient Rendering**: Uses CSS transforms and opacity for smooth animations
4. **Lazy Loading**: Images are loaded on-demand with proper error handling
5. **Debounced Events**: Hover and search events are debounced for better performance
6. **RequestAnimationFrame**: Used for smooth animations and interactions
7. **Optimized Field Positioning**: Percentage-based positioning for perfect alignment during rotation

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode compatibility
- Focus management for modals

## Future Enhancements

- Advanced field validation
- Export functionality
- Batch processing capabilities
- Real-time collaboration
- Advanced search and filtering
- OCR confidence heatmap
- Annotation tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
