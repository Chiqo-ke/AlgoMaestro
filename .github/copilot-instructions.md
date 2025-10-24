# AlgoMaestro Development Instructions

## Project Overview
This is a React TypeScript project built with Next.js for an algorithmic trading platform called AlgoMaestro. The platform allows users to create trading strategies using natural language, get AI analysis, perform backtesting, and execute live trading.

## Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Icons**: Lucide React
- **Package Manager**: npm

## Development Guidelines

### Code Style
- Use TypeScript for all components and utilities
- Follow React functional component patterns with hooks
- Use Tailwind CSS classes for styling
- Maintain consistent dark theme throughout the application
- Use proper TypeScript types for props and state

### Component Structure
- All components are in `/src/components/`
- Main application logic is in `/src/app/page.tsx`
- Global styles and Tailwind configuration in `/src/app/globals.css`

### Key Features Implemented
1. **Strategy Creation**: Natural language input with AI analysis simulation
2. **Strategy Management**: Sidebar listing with status tracking
3. **Backtesting**: Comprehensive backtesting interface with metrics
4. **Live Trading**: Trading controls with risk management
5. **Dark Theme UI**: Professional trading platform aesthetic

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Future Backend Integration
The frontend is designed to easily integrate with a backend API for:
- Strategy persistence
- Real market data
- Actual trading execution
- User authentication