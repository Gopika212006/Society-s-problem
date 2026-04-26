# CivicFix - Civic Issue Reporting Platform

CivicFix is a modern web application for reporting and tracking civic issues in Salem, Tamil Nadu. Citizens can report problems like water leaks, road damage, electricity issues, sanitation problems, and more. The platform provides real-time tracking, SLA monitoring, and community engagement features.

## Features

🏛️ **Civic Issue Reporting**
- Report various categories: Water, Electricity, Roads, Sanitation, Parks, Drainage, Transport, Noise
- Detailed descriptions and location tagging
- Photo upload support
- Public visibility and community engagement

📋 **Issue Tracking**
- Real-time status updates (Pending, In Progress, Escalated, Resolved)
- SLA (Service Level Agreement) monitoring with visual progress indicators
- Complete tracking timeline with officer notes
- Time-tracked complaint journey from submission to resolution

👥 **Community Features**
- Community confirmations to validate issues
- See who reported and who confirmed each issue
- Build collective awareness of civic problems

🚨 **Escalation System**
- Escalate complaints to higher authorities when needed
- Track escalation status
- Priority handling for critical issues

📊 **Dashboard & Analytics**
- View statistics (Total, Pending, Active, Resolved issues)
- Filter by status or category
- Search issues by title or location
- Personal complaint history

👤 **User Profiles**
- View personal statistics (reports filed, resolved, confirmations)
- Verified citizen badge
- Active reporter recognition
- Account management and settings

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Inline CSS with CSS variables
- **Fonts**: Google Fonts (Nunito)
- **State Management**: React Hooks (useState)

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gopika212006/Society-s-problem.git
cd Society-s-problem
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Key Components

- **Auth** - Mobile number based OTP authentication
- **IssueCard** - Displays individual issue in feed
- **IssueDetail** - Complete issue tracking and details view
- **ReportForm** - Two-step form to file new complaint
- **MyComplaints** - User's personal complaint history
- **Profile** - User profile and statistics
- **Toast** - Notification system

## Features Overview

### Report an Issue
1. Tap "Report a New Issue" button
2. Fill in problem title, select category, and location
3. Add detailed description and optional photo
4. Submit and get tracking ID

### Track Issues
- View real-time progress with timeline
- Check SLA compliance
- See officer notes and updates
- Community confirmations count

### Escalate Issues
- If SLA is breached, escalate to higher authority
- Tracks escalation history
- Priority handling for urgent issues

### My Complaints
- View all issues you reported
- Quick access to issue details
- Track resolution status

## Data Structure

Each issue includes:
- Unique ID (CF-XXXX)
- Title, category, and severity
- Location and description
- Current status
- SLA (Service Level Agreement) hours
- Elapsed time
- Officer assignments
- Tracking timeline
- Community confirmations

## Styling

The app uses a custom color scheme with CSS variables:
- Blue: Primary actions and trusted elements
- Green: Resolved/positive states
- Red: Escalated/critical issues
- Yellow: Pending/warning states
- Purple: Secondary actions

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions about the platform, please contact the development team or file an issue on GitHub.

---

**Made with ❤️ for the citizens of Salem, Tamil Nadu**