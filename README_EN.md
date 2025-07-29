# International School Business Intelligence Portal

<div align="center">

![Logo](https://img.shields.io/badge/School-BI%20Portal-blue?style=for-the-badge&logo=graduation-cap)

**An intelligent education management platform designed specifically for international schools**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success?style=flat-square)](http://inspire.long-arena.com/schoolbiportal)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Vue3%20|%20TypeScript%20|%20Vite-orange?style=flat-square)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📖 Project Overview

The International School Business Intelligence Portal is a comprehensive intelligent education management platform that enhances admission efficiency, strengthens school-home communication, optimizes academic feedback, and provides college guidance through data-driven approaches. The system adopts modern frontend technologies, offering an intuitive user interface and rich data visualization capabilities.

### 🎯 Vision

- **Intelligent Admission**: Generate personalized academic planning reports through interactive questionnaires
- **Warm School-Home Communication**: Record every precious moment of students' campus life
- **Data-Driven Feedback**: AI-based academic performance analysis and development recommendations
- **Visualized College Guidance**: Intelligent college pathway planning and goal adjustment

---

## ✨ Features

### 🤖 AI-Powered Admission Engine
- **Intelligent Admission Engine**: Advanced AI-driven admission consultation system
- **Student Profile Analysis**: Automatic recognition of student names, grades, interests, and target universities
- **Conversational Interface**: Modern chat-based interaction with real-time responses
- **Personalized Academic Planning**: Generate customized academic plans with university recommendations
- **Multi-AI Provider Support**: Integration with OpenAI, Baidu Wenxin, Alibaba Tongyi, and mock services
- **Intelligent Fallback**: Seamless service switching to ensure system reliability

### 👥 Teacher Collaboration & Meeting Management
- **Meeting Management System**: Complete meeting lifecycle management with creation, editing, and status tracking
- **Teacher Collaboration Hub**: Enhanced collaboration platform for multi-teacher coordination
- **Meeting Components**: Comprehensive meeting list, details, and management interfaces
- **Teacher Invitation System**: Streamlined teacher invitation and participation management
- **Real-time Notifications**: Integrated notification system for meeting reminders and updates
- **Collaborative Workflows**: Optimized teacher-to-teacher collaboration processes

### 🎓 Admission Consultation System
- **Traditional Questionnaire**: Multi-step forms to collect student information and educational needs
- **AI-Enhanced Consultation**: Next-generation conversational admission guidance
- **Personalized Report Generation**: Automatically generate academic planning recommendations
- **Course Recommendations**: Suggest suitable courses based on student interests and goals
- **Timeline Planning**: Create detailed learning schedules and milestones

### 💬 School-Home Communication Platform
- **Quick Recording**: Conveniently record students' daily performance and interaction moments
- **Interactive Timeline**: Timeline display of students' growth journey
- **Smart Sharing**: One-click sharing of precious moments with parents
- **Multi-dimensional Filtering**: Filter records by type, student, time, and other dimensions

### 📊 Academic Feedback Analysis
- **Radar Chart Display**: Intuitively display student performance across subjects
- **Trend Analysis**: Grade change trends and predictive analysis
- **AI Intelligence Report**: Personalized academic analysis based on data
- **Development Recommendations**: Targeted learning improvement suggestions

### 🎯 College Guidance System
- **Visualized Pathway Chart**: 3D college pathway display and interaction
- **Progress Dashboard**: Real-time tracking of college preparation progress
- **Milestone Management**: Setting and tracking of important milestones
- **Intelligent Goal Adjustment**: Dynamic adjustment of college goals based on performance

### 🌐 Internationalization Support
- **Bilingual Interface**: Complete Chinese and English support
- **Dynamic Switching**: Real-time language switching without page refresh
- **Localized Storage**: Automatic saving of language preferences
- **Professional Translation**: Accurate translation of education industry terminology

---

## 🚀 Quick Start

### Online Experience
Visit the live demo directly: [http://inspire.long-arena.com/schoolbiportal](http://inspire.long-arena.com/schoolbiportal)

### Local Development

#### Prerequisites
- Modern browser (Chrome 80+, Firefox 75+, Safari 13+)
- Local web server (optional, for development)

#### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/wukeping2008/school-businessintelligence.git
cd school-businessintelligence
```

2. **Start Local Server**
```bash
# Using Python (recommended)
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000

# Or using PHP
php -S localhost:8000
```

3. **Access Application**
Open your browser and visit `http://localhost:8000`

#### Quick Preview
For a quick look, you can directly open the `index.html` file in your browser.

---

## 🛠 Tech Stack

### Modern Vue 3 Application
| Technology | Version | Description |
|------------|---------|-------------|
| **Vue 3** | 3.4+ | Progressive JavaScript framework with Composition API |
| **TypeScript** | 5.x | Type-safe JavaScript development with comprehensive type coverage |
| **Vite** | 5.x | Fast build tool and development server |
| **Element Plus** | 2.x | Vue 3 UI component library |
| **Pinia** | 2.x | Vue state management library |
| **Vue Router** | 4.x | Official router for Vue.js |
| **SCSS** | - | Advanced CSS preprocessing with variables and mixins |

### Backend & Services
| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime for server-side development |
| **Express** | 4.18+ | Web application framework for Node.js |
| **TypeScript** | 5.x | Server-side type safety and development experience |
| **JWT** | - | JSON Web Token for authentication |
| **WebSocket** | - | Real-time communication for collaboration features |

### AI & Visualization
| Technology | Version | Description |
|------------|---------|-------------|
| **OpenAI API** | - | Advanced AI language model integration |
| **Baidu Wenxin** | - | Chinese AI service integration |
| **Alibaba Tongyi** | - | Alternative AI service provider |
| **ECharts** | 5.x | Complex visualization, 3D charts, relationship graphs |
| **Chart.js** | 3.x | 2D chart library for data visualization |

### Legacy Version (v1.x)
| Technology | Version | Description |
|------------|---------|-------------|
| **HTML5** | - | Semantic tags, modern web standards |
| **CSS3** | - | Flexbox/Grid layout, animations |
| **JavaScript** | ES6+ | Modular development, modern syntax |
| **Font Awesome** | 6.x | Vector icon library |

### Development Tools
- **VS Code**: Primary development environment
- **Chrome DevTools**: Debugging and performance analysis
- **Git**: Version control
- **npm**: Package management with Taobao mirror

---

## 📁 Project Structure

```
school-bi-portal/
├── � hd-schools-vue/              # Vue 3 Application
│   ├── 📁 src/
│   │   ├── 📁 components/           # Reusable Vue components
│   │   │   └── 📁 ai/               # AI-related components
│   │   ├── 📁 views/                # Page-level components
│   │   │   ├── � AdmissionAI.vue   # AI-powered admission interface
│   │   │   └── 📁 TeacherDashboard/ # Teacher collaboration system
│   │   │       ├── 🏠 index.vue     # Main dashboard
│   │   │       └── 📁 components/   # Dashboard components
│   │   │           ├── � MeetingManagement.vue
│   │   │           ├── 📋 MeetingList.vue
│   │   │           ├── 📝 MeetingDetails.vue
│   │   │           ├── 👥 TeacherInvitation.vue
│   │   │           └── 🤝 CollaborationHub.vue
│   │   ├── 📁 services/             # Business logic services
│   │   │   └── 📁 ai/               # AI service integrations
│   │   │       ├── 🧠 intelligent-admission-engine.ts
│   │   │       ├── 🔧 ai-service-base.ts
│   │   │       ├── 🤖 openai-service.ts
│   │   │       ├── � wenxin-service.ts
│   │   │       └── 🌟 tongyi-service.ts
│   │   ├── 📁 stores/               # Pinia state management
│   │   ├── 📁 types/                # TypeScript type definitions
│   │   └── � composables/          # Vue 3 composition functions
│   ├── � server/                   # Backend Node.js server
│   │   ├── 📁 src/
│   │   │   ├── 📁 middleware/       # Express middleware
│   │   │   ├── 📁 models/           # Data models
│   │   │   ├── � routes/           # API routes
│   │   │   └── 📁 services/         # Business services
│   │   ├── � start-dev.js          # Development server
│   │   └── 🎭 start-mock.js         # Mock server
├── 📁 docs/                         # Documentation
├── 📋 PROJECT_DEVELOPMENT_PLAN_v3.2.md # Latest development plan
├── � AI_INTEGRATION_SUMMARY.md     # AI integration documentation
├── 📖 README.md                     # Project description (Chinese)
├── 📖 README_EN.md                  # Project description (English)
└── 📄 LICENSE                       # License file
```

### Core Module Description

#### 🧠 AI Services Layer
- **Intelligent Admission Engine**: Core AI-powered admission consultation system
- **Multi-Provider Integration**: Support for OpenAI, Baidu Wenxin, Alibaba Tongyi, and mock services
- **Student Profile Analyzer**: Automatic extraction and analysis of student information
- **Conversation Management**: Complete chat session lifecycle and state management
- **Fallback Mechanisms**: Intelligent service switching and error recovery

#### 👥 Teacher Collaboration System
- **Meeting Management**: Complete meeting lifecycle with creation, editing, and tracking
- **Collaboration Hub**: Central platform for teacher-to-teacher coordination
- **Invitation System**: Streamlined teacher invitation and participation management
- **Real-time Features**: Live notifications and status updates
- **Dashboard Integration**: Seamless integration with teacher workflow

#### �️ Frontend Architecture
- **Vue 3 Composition API**: Modern reactive framework with TypeScript support
- **Component System**: Reusable UI components with consistent design patterns
- **State Management**: Pinia-based centralized state with persistent storage
- **Routing System**: Vue Router 4 with lazy loading and navigation guards
- **Internationalization**: Complete i18n system with dynamic language switching

#### � Backend Services
- **Authentication Middleware**: JWT-based user authentication and authorization
- **User Management**: Comprehensive user and student model management
- **API Routes**: RESTful API design with TypeScript type safety
- **Development Tools**: Hot-reload development server and mock data support
- **Database Integration**: Flexible data persistence with model relationships

#### 🌐 Legacy Module Support (v1.x compatibility)
- **Data Management**: Mock data definition and operation interfaces
- **Chart Visualization**: Advanced data visualization with multiple chart types
- **Export Functions**: Report generation and data export capabilities
- **Timeline Features**: Interactive timeline rendering and management

---

## 🎨 Interface Preview

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Preview)

### Admission Consultation System
![Admission System](https://via.placeholder.com/800x400/f093fb/ffffff?text=Admission+System)

### School-Home Communication Platform
![Communication Platform](https://via.placeholder.com/800x400/43e97b/ffffff?text=Communication+Platform)

### Academic Feedback Analysis
![Academic Feedback](https://via.placeholder.com/800x400/4facfe/ffffff?text=Academic+Feedback)

### College Guidance System
![College Guidance](https://via.placeholder.com/800x400/ff6b6b/ffffff?text=College+Guidance)

---

## 🚀 Deployment

### Production Deployment

#### 1. Server Setup
```bash
# Install Nginx
sudo yum install nginx

# Start Nginx service
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/schoolbiportal;
    index index.html;
    
    # Static file caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Single page application routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### 3. Deploy Files
```bash
# Upload files to server
scp -r ./school-bi-portal/* user@server:/var/www/html/schoolbiportal/

# Set permissions
sudo chown -R nginx:nginx /var/www/html/schoolbiportal
sudo chmod -R 755 /var/www/html/schoolbiportal

# Restart Nginx
sudo systemctl reload nginx
```

### Docker Deployment (Optional)

```dockerfile
FROM nginx:alpine

# Copy project files
COPY . /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build image
docker build -t school-bi-portal .

# Run container
docker run -d -p 80:80 school-bi-portal
```

---

## 🔧 Development Guide

### Development Environment Setup

1. **Install Development Tools**
```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

2. **Configure Code Formatting**
Create `.vscode/settings.json`:
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "javascript.preferences.quoteStyle": "single",
    "typescript.preferences.quoteStyle": "single"
}
```

### Code Standards

#### JavaScript Standards
```javascript
// ✅ Recommended
const studentName = 'Zhang San';
const getUserInfo = async (id) => {
    try {
        const response = await fetch(`/api/users/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to get user info:', error);
        throw error;
    }
};

// ❌ Not recommended
var student_name = "Zhang San";
function getUserInfo(id, callback) {
    // Callback hell...
}
```

#### CSS Standards
```css
/* ✅ Recommended */
.student-card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.student-card__header {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

/* ❌ Not recommended */
.studentCard {
    padding: 16px;
    /* Inline styles and magic numbers */
}
```

### Adding New Features

1. **Create New Module**
```javascript
// scripts/new-module.js
class NewModule {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadData();
    }
    
    setupEventListeners() {
        // Event listeners
    }
    
    loadData() {
        // Data loading
    }
}
```

2. **Register Module**
```javascript
// main.js
initializeNewModule() {
    if (typeof NewModule !== 'undefined') {
        this.newModule = new NewModule();
    }
}
```

3. **Add Internationalization**
```javascript
// i18n.js
'newModule.title': 'New Module Title',
'newModule.description': 'New Module Description',
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Functional Testing
- [ ] Page navigation works properly
- [ ] All forms can be submitted normally
- [ ] Charts render and interact correctly
- [ ] Data filtering and search functionality
- [ ] File export functionality

#### Internationalization Testing
- [ ] Chinese-English switching works
- [ ] All text has translations
- [ ] Dynamic content translates correctly
- [ ] Language preferences are saved

#### Compatibility Testing
- [ ] Chrome 80+
- [ ] Firefox 75+
- [ ] Safari 13+
- [ ] Edge 80+

#### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Automated Testing (Planned)

```javascript
// Test example
describe('Admission Consultation System', () => {
    test('should render questions correctly', () => {
        const admission = new AdmissionModule();
        expect(admission.questions.length).toBeGreaterThan(0);
    });
    
    test('should generate report', () => {
        const admission = new AdmissionModule();
        admission.answers = { grade: 'Grade 10', interests: 'Science & Technology' };
        const report = admission.generateReport();
        expect(report).toBeDefined();
    });
});
```

---

## 📈 Performance Optimization

### Implemented Optimizations

1. **Resource Optimization**
   - Image compression and format optimization
   - CSS and JavaScript file compression
   - Font file optimization

2. **Loading Optimization**
   - Critical resource priority loading
   - Non-critical resource lazy loading
   - Image lazy loading

3. **Caching Strategy**
   - Browser cache configuration
   - LocalStorage data caching
   - Long-term static resource caching

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Screen Load Time | < 2s | ~1.5s |
| Page Switch Time | < 500ms | ~300ms |
| Chart Render Time | < 1s | ~800ms |
| Memory Usage | < 50MB | ~35MB |

---

## 🔒 Security Considerations

### Implemented Security Measures

1. **Input Validation**
   - Form data validation
   - XSS protection
   - Input length restrictions

2. **Data Security**
   - Sensitive information masking
   - Local storage encryption
   - Data transmission security

3. **Access Control**
   - Permission checking mechanism
   - Role management system
   - Operation logging

### Security Best Practices

```javascript
// Input validation example
function validateInput(input, type) {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^1[3-9]\d{9}$/,
        name: /^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/
    };
    
    return patterns[type]?.test(input) || false;
}

// XSS protection example
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
```

---

## 🤝 Contributing

We welcome all forms of contributions! Whether it's bug reports, feature suggestions, or code contributions.

### How to Contribute

1. **Fork the Project**
   ```bash
   git clone https://github.com/wukeping2008/school-businessintelligence.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'feat: add an amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**

### Commit Standards

We use [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type Description:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting adjustment
- `refactor`: Code refactoring
- `test`: Test related
- `chore`: Build process or auxiliary tool changes

**Example:**
```
feat(admission): add intelligent questionnaire system

- Implement multi-step form process
- Add question validation logic
- Integrate report generation functionality

Closes #123
```

### Code Review

All Pull Requests require code review:

1. **Code Quality**: Follow project coding standards
2. **Functional Testing**: Ensure new features work properly
3. **Compatibility**: Test browser compatibility
4. **Documentation Update**: Update relevant documentation

---

## 📋 Changelog

### v2.1.1 (2025-07-29) - Latest
- ✨ **New Features**
  - Teacher Collaboration & Meeting Management System
  - Complete meeting lifecycle management (create, edit, delete, track)
  - Teacher invitation and participation management
  - Enhanced collaboration hub with real-time features
  - Optimized teacher dashboard with collaborative workflows

- 🔧 **Backend Improvements**
  - Enhanced authentication middleware with JWT support
  - Optimized user and student models
  - Updated API routes and TypeScript definitions
  - Added development and mock server scripts
  - Improved error handling and validation

- 🎨 **UI/UX Enhancements**
  - Modern meeting management interface
  - Responsive design improvements for mobile devices
  - Enhanced state management and data persistence
  - Improved component reusability and modularity

### v2.1.0 (2025-01-19)
- ✨ **New Features**
  - AI-Powered Admission Engine with multi-provider support
  - Intelligent student profile analysis and conversation management
  - Advanced chat interface with real-time AI responses
  - Personalized academic planning generation
  - Complete Vue 3 + TypeScript migration

- � **Technical Improvements**
  - Modern frontend architecture with Vite and Pinia
  - Comprehensive TypeScript type coverage (98%+)
  - Component-based development with Element Plus
  - Enhanced internationalization system

### v1.0.0 (2025-01-11)
- ✨ **Foundation Features**
  - Complete admission consultation system
  - School-home communication platform
  - Academic feedback analysis
  - College guidance system
  - Complete internationalization support

### Planned Updates

#### v2.2.0 (Planned)
- 🔄 Video conferencing integration
- 🔄 Advanced real-time collaboration features
- 🔄 Mobile-optimized meeting management
- 🔄 Enhanced AI service integrations

#### v2.3.0 (Planned)
- 🔄 Document collaboration and editing
- 🔄 Task assignment and tracking
- 🔄 Project management integration
- 🔄 Advanced analytics and reporting

---

## 🆘 FAQ

### Q: How to switch languages?
A: Click the language toggle button in the top right corner and select Chinese or English.

### Q: Will data be saved?
A: The current version uses local storage, data is saved in the browser. Future versions will support cloud storage.

### Q: Which browsers are supported?
A: Supports modern browsers like Chrome 80+, Firefox 75+, Safari 13+, Edge 80+.

### Q: How to export reports?
A: Click the "Export" button in the respective module, and the system will generate a JSON format report file.

### Q: How to add new students?
A: The current version uses mock data, you can add new student information in the data.js file.

### Q: Does the system support mobile devices?
A: The system uses responsive design and supports mobile access, but the best experience is still on desktop.

---

## 📞 Contact Us

### Project Team
- **Project Manager**: [TBD]
- **Technical Lead**: [TBD]
- **Product Manager**: [TBD]

### Technical Support
- **Email**: support@schoolbiportal.com
- **Website**: https://schoolbiportal.com
- **Documentation**: https://docs.schoolbiportal.com

### Community
- **GitHub**: https://github.com/wukeping2008/school-businessintelligence
- **Discussions**: https://github.com/wukeping2008/school-businessintelligence/discussions
- **Issue Tracking**: https://github.com/wukeping2008/school-businessintelligence/issues

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 School BI Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Thanks to the following open source projects and tools:

- [Chart.js](https://www.chartjs.org/) - Excellent charting library
- [ECharts](https://echarts.apache.org/) - Powerful visualization library
- [Font Awesome](https://fontawesome.com/) - Rich icon library
- [MDN Web Docs](https://developer.mozilla.org/) - Excellent web technology documentation

---

<div align="center">

**⭐ If this project helps you, please give us a star!**

[⬆ Back to Top](#international-school-business-intelligence-portal)

</div>
