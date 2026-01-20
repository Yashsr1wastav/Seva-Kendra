# HealthCare NGO - Frontend Application

A modern, responsive web application built for NGOs and healthcare organizations to manage patient care, medical records, and health services. Built with React, Vite, Tailwind CSS, and shadcn/ui components.

## 🌟 Features

- **Modern Sign-In Page**: Beautiful, accessible authentication interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Health-Focused UI**: Custom color scheme and components designed for healthcare
- **Component Library**: Reusable UI components using shadcn/ui patterns
- **Fast Development**: Vite for lightning-fast builds and hot reloading
- **Type Safety**: JavaScript with ESLint for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ngo-health-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components (Button, Input, Card, etc.)
├── pages/               # Page components
│   ├── SignIn.jsx       # Sign-in page
│   └── Dashboard.jsx    # Dashboard page
├── lib/
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind directives
```

## 🎨 Design System

### Color Palette

The application uses a professional, cohesive color palette designed for healthcare and social justice organizations:

- **Primary**: `#1B3C53` - Deep blue for primary actions, headers, navigation bars, and key UI elements
- **Secondary**: `#234C6A` - Medium blue for secondary buttons, links, hover states, and highlights
- **Accent**: `#456882` - Steel blue for accents, icons, borders, focus states, and subtle UI emphasis
- **Background / Light Surface**: `#E3E3E3` - Light gray for page backgrounds, cards, sections, and neutral surfaces

#### Color Application Guide

- Use **Primary (#1B3C53)** for: Primary action buttons, main headers, navigation elements, critical information
- Use **Secondary (#234C6A)** for: Secondary buttons, text links, hover states, secondary headers
- Use **Accent (#456882)** for: Icon accents, input focus states, decorative borders, emphasis elements
- Use **Background (#E3E3E3)** for: Page backgrounds, card backgrounds, section dividers, neutral UI surfaces

#### Accessibility

All color combinations maintain WCAG AA contrast ratios to ensure readability for all users, including those with color blindness or visual impairments.

### Components

- **Button**: Multiple variants including health-specific styling
- **Input**: Form inputs with health organization focus states
- **Card**: Content containers with subtle shadows and health branding
- **Label**: Form labels with consistent typography

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library patterns
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **ESLint** - Code linting

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Streamlined interface with mobile-first design

## 🔐 Authentication

The sign-in page includes:

- Email and password validation
- Show/hide password functionality
- Remember me checkbox
- Forgot password link
- Form validation and error handling

## 🎯 Next Steps

To extend this application, consider adding:

- User registration page
- Patient management system
- Appointment scheduling
- Medical records management
- Reporting and analytics
- Multi-language support
- Dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
