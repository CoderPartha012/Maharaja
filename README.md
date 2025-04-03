# Maharaja - Authentic Indian Restaurant Website

![Maharaja Restaurant](https://i.postimg.cc/JhkbNDq1/ksjdhksjd.png)

## 🌍 Live Demo

Check out the live version of Maharaja - Authentic Indian Restaurant Website: [Maharaja - Authentic Indian Restaurant Website Live](https://maharaja-a-simple-restaurant.netlify.app/)

## Overview

Maharaja is a modern, responsive website for an authentic Indian restaurant, built with React, TypeScript, and Tailwind CSS. The website offers a seamless user experience for viewing the menu, making reservations, exploring the gallery, and getting in touch with the restaurant.

## Features

- 🏠 **Responsive Home Page**: Beautiful hero section and featured content
- 🍽️ **Interactive Menu**: 
  - Categorized North and South Indian cuisine
  - Vegetarian and Non-vegetarian sections
  - Filtering by cuisine type and spice level
  - Visual indicators for spice levels and dietary preferences
- 📅 **Reservation System**:
  - Date and time slot selection
  - Guest count management
  - Special requests handling
- 🖼️ **Gallery**:
  - Image categorization (Interior, Dishes, Events)
  - Interactive image viewing with zoom capability
  - Responsive grid layout
- 📱 **Contact Page**:
  - Contact form with validation
  - Interactive map integration
  - Business hours and location information
- 🎨 **Design Features**:
  - Custom color scheme
  - Responsive navigation
  - Smooth animations
  - Mobile-first approach

## Tech Stack

- ⚛️ **React** (v18.3.1)
- 📘 **TypeScript**
- 🎨 **Tailwind CSS**
- 🚀 **Vite**
- 📦 **Additional Libraries**:
  - `react-router-dom` for navigation
  - `lucide-react` for icons
  - `framer-motion` for animations
  - `react-datepicker` for date selection
  - `react-medium-image-zoom` for image zooming

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/maharaja-restaurant.git
   ```

2. Navigate to the project directory:
   ```bash
   cd maharaja-restaurant
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
maharaja-restaurant/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── App.tsx           # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json        # Project dependencies and scripts
```

## Key Components

### Navigation
- Responsive navbar with mobile menu
- Smooth scrolling to sections
- Active link indicators

### Menu System
- Categorized dishes
- Price display
- Spice level indicators
- Dietary preference filters

### Reservation System
- Date picker integration
- Time slot selection
- Form validation
- Confirmation system

### Gallery
- Image grid layout
- Category filtering
- Image zoom functionality
- Smooth transitions

### Contact Form
- Input validation
- Success feedback
- Map integration
- Business information display

## Styling

The project uses Tailwind CSS with a custom configuration:

- Custom color palette
- Responsive design utilities
- Custom component classes
- Animation utilities

## Performance Optimizations

- Lazy loading of images
- Component code splitting
- Optimized build configuration
- Responsive image serving

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Images from Unsplash
- Icons from Lucide React
- Font families from Google Fonts
