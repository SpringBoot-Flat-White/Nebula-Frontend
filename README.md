# Nebula Frontend 🌌

Nebula is a modern cloud database management platform that allows users to create and manage database instances in the cloud. This is the frontend application built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Context API** - State management for authentication

## 📁 Project Structure

```
Nebula-Frontend/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── assets/            # Images, icons, and media files
│   ├── components/        # Reusable React components
│   │   ├── landing/       # Landing page specific components
│   │   │   ├── Hero.tsx              # Hero section with CTA
│   │   │   ├── Features.tsx          # Features showcase (6 cards)
│   │   │   ├── DatabaseEngines.tsx   # Supported databases display
│   │   │   ├── Pricing.tsx           # Pricing plans (Free, Standard, Premium)
│   │   │   └── CTA.tsx               # Call-to-action section
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.tsx            # Navigation bar with auth state
│   │   │   └── Footer.tsx            # Footer with links and info
│   │   └── ProtectedRoute.tsx        # Route wrapper for authenticated pages
│   ├── context/           # React Context providers
│   │   └── AuthContext.tsx           # Authentication state management
│   ├── pages/             # Page components (route views)
│   │   ├── LandingPage.tsx           # Home page with all sections
│   │   ├── LoginPage.tsx             # User login form
│   │   ├── RegisterPage.tsx          # User registration form
│   │   └── DashboardPage.tsx         # User dashboard (protected)
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts                  # Shared interfaces and types
│   ├── App.tsx            # Main app component with routing
│   ├── App.css            # App-specific styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration (main)
├── tsconfig.app.json      # TypeScript config for app code
├── tsconfig.node.json     # TypeScript config for Node scripts
└── vite.config.ts         # Vite configuration

```

## 📂 Detailed File Explanations

### Root Configuration Files

- **`package.json`** - Project dependencies, scripts, and metadata
- **`vite.config.ts`** - Vite build tool configuration (dev server, plugins, build options)
- **`tsconfig.json`** - Base TypeScript configuration
- **`tsconfig.app.json`** - TypeScript config for application code
- **`tsconfig.node.json`** - TypeScript config for Node.js scripts (Vite config)
- **`tailwind.config.js`** - Tailwind CSS customization (colors, themes, extensions)
- **`postcss.config.js`** - PostCSS plugins configuration (Tailwind, Autoprefixer)
- **`eslint.config.js`** - Linting rules and configuration
- **`index.html`** - Main HTML template, entry point for Vite

### `/src` - Source Code

#### Main Files

- **`main.tsx`** - Application entry point, renders the root React component
- **`App.tsx`** - Main app component, sets up React Router and AuthProvider
- **`App.css`** - App-level styles
- **`index.css`** - Global styles, Tailwind imports, and custom CSS classes

#### `/src/types` - TypeScript Definitions

- **`index.ts`** - All TypeScript interfaces and types:
  - `User` - User data structure (id, name, email, plan, accountType)
  - `LoginCredentials` - Login form data
  - `RegisterData` - Registration form data
  - `AuthContextType` - Authentication context interface
  - `DatabaseEngine` - Database engine information
  - `PricingPlan` - Pricing plan structure
  - `Feature` - Feature card structure

#### `/src/context` - State Management

- **`AuthContext.tsx`** - Authentication context provider:
  - Manages user authentication state
  - Provides `login()`, `register()`, and `logout()` methods
  - Handles token persistence with localStorage
  - Exposes `isAuthenticated`, `user`, and `isLoading` state
  - **Note:** Currently uses mock API calls, ready for backend integration

#### `/src/pages` - Page Components

- **`LandingPage.tsx`** - Home page that displays:
  - Header navigation
  - Hero section
  - Features section
  - Database engines showcase
  - Pricing plans
  - Call-to-action
  - Footer

- **`LoginPage.tsx`** - User login page:
  - Email and password form
  - Form validation
  - Error handling
  - Integration with AuthContext
  - Redirects to dashboard on success

- **`RegisterPage.tsx`** - User registration page:
  - User information form (name, email, password)
  - Automatically registers users as "individual" type
  - Terms and conditions acceptance
  - Error handling and loading states
  - Redirects to dashboard on success

- **`DashboardPage.tsx`** - Protected user dashboard:
  - Displays user information (name, email, plan, account type)
  - Welcome message
  - Logout functionality
  - Placeholder for future instance management features

#### `/src/components/layout` - Layout Components

- **`Header.tsx`** - Navigation bar:
  - Logo and brand name
  - Navigation links (Features, Pricing, Engines)
  - Authentication state display:
    - Shows "Sign In" and "Sign Up" when not authenticated
    - Shows user avatar and dropdown menu when authenticated
  - User dropdown with Dashboard link and Logout button
  - Responsive design

- **`Footer.tsx`** - Footer section:
  - Company information
  - Product links
  - Resources links
  - Company links
  - Social media links
  - Copyright notice

#### `/src/components/landing` - Landing Page Sections

- **`Hero.tsx`** - Hero section:
  - Main headline and value proposition
  - Call-to-action buttons
  - Gradient background
  - Animated elements

- **`Features.tsx`** - Features showcase:
  - Displays 6 key features in a grid
  - Feature cards with icons, titles, and descriptions
  - Features: Multi-Engine Support, Instant Deployment, Auto-Scaling, Secure by Default, Real-time Monitoring, Backup & Recovery

- **`DatabaseEngines.tsx`** - Supported databases:
  - Displays 6 database engines with logos
  - MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra
  - Hover effects and animations

- **`Pricing.tsx`** - Pricing plans:
  - 3 pricing tiers: Free, Standard, Premium
  - Feature lists for each plan
  - Pricing information
  - Call-to-action buttons
  - Highlights Standard plan as "Most Popular"

- **`CTA.tsx`** - Call-to-action section:
  - Final conversion section
  - Encourages users to get started
  - Button to registration page

#### `/src/components` - Other Components

- **`ProtectedRoute.tsx`** - Route protection wrapper:
  - Checks authentication state
  - Shows loading spinner while checking
  - Redirects to login if not authenticated
  - Renders children if authenticated
  - Used to protect the Dashboard route

## 🎨 Styling

### Tailwind Configuration

The project uses a custom Tailwind configuration with:

- **Primary Color:** Purple (#8b5cf6)
- **Secondary Color:** Blue (#3b82f6)
- **Custom Classes:** Defined in `index.css`
  - `.btn-primary` - Primary button style
  - `.btn-secondary` - Secondary button style
  - `.card` - Card container style
  - `.gradient-text` - Purple-to-blue gradient text

### Color Palette

```js
colors: {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    // ... (full purple scale)
    600: '#8b5cf6',
    // ...
  },
  secondary: {
    // ... (full blue scale)
    600: '#3b82f6',
    // ...
  }
}
```

## 🔐 Authentication Flow

1. **Registration** (`/register`):
   - User fills registration form
   - Account created as "individual" type by default
   - User automatically logged in
   - Redirected to dashboard

2. **Login** (`/login`):
   - User enters credentials
   - Authentication validated
   - Token stored in localStorage
   - Redirected to dashboard

3. **Protected Routes**:
   - Dashboard requires authentication
   - ProtectedRoute checks auth state
   - Redirects to login if not authenticated

4. **Logout**:
   - Clears authentication state
   - Removes token from localStorage
   - Redirects to home page

## 🚦 Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | LandingPage | No | Home page with all sections |
| `/login` | LoginPage | No | User login form |
| `/register` | RegisterPage | No | User registration form |
| `/dashboard` | DashboardPage | Yes | User dashboard (requires auth) |

## 🛠️ Available Scripts

```bash
# Install dependencies
npm install

# Start development server (usually runs on http://localhost:5173 or 5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔧 Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SpringBoot-Flat-White/Nebula-Frontend.git
   cd Nebula-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📝 Key Features

- ✅ Fully responsive design
- ✅ Modern gradient-based UI
- ✅ Type-safe with TypeScript
- ✅ Client-side routing with React Router
- ✅ Authentication state management
- ✅ Protected routes
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ localStorage persistence
- ✅ Dropdown menus with click-outside handling
- ✅ Smooth animations and transitions

## 🔮 Future Enhancements

### Backend Integration
- Replace mock authentication with real API calls
- Connect to actual backend endpoints
- Implement JWT token refresh logic
- Add API service layer

### Dashboard Features
- Create database instances
- Manage running instances
- View connection credentials
- Rotate passwords
- Monitor instance health
- View usage statistics

### Additional Features
- Password reset functionality
- Email verification
- User profile settings
- Billing and payment integration
- Organization management (for organization accounts)
- Team collaboration features
- Activity logs

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure code follows ESLint rules
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Nebula cloud database management platform.

---

**Built with ❤️ by the SpringBoot-Flat-White team**

