# HealthIS - Healthcare Information System

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://health-system-livid.vercel.app/)

A comprehensive healthcare information management system for tracking clients, programs, and health outcomes. HealthIS enables healthcare providers to manage client information, enroll clients in health programs, and track their progress.

![Dashboard Screenshot](public\dashboard.png)

## 📋 Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [How the Solution Addresses the Challenge](#how-the-solution-addresses-the-challenge)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)

## 🔍 Project Overview

HealthIS is a modern healthcare information system developed to address the challenge of managing clients and health programs/services. It provides a clean, intuitive interface for healthcare workers to manage client information, enroll clients in various health programs, and track their healthcare journey.

The system was designed with both usability and security in mind, ensuring that healthcare data is both accessible to authorized users and protected from unauthorized access.

## ✨ Features

- **User Authentication**: Secure login with email/password or Google OAuth
- **Role-Based Access**: Different access levels for different types of users
- **Dashboard**: Visual overview of system statistics and recent activities
- **Client Management**: Register, search, and manage client information
- **Program Management**: Create and manage health programs
- **Client Enrollment**: Enroll clients in multiple health programs
- **API Access**: External system integration via secure API endpoints
- **Data Visualization**: Charts and reports for program statistics
- **Responsive Design**: Works on desktop and mobile devices

## 🌐 Live Demo

The system is deployed and available at: [https://health-system-livid.vercel.app/](https://health-system-livid.vercel.app/)

To test the system, you can use the following credentials:

- Email: `doctor.test@gmail.com`
- Password: `password123`

or you can proceed and create your account.(Please Note that doctors have full system permissions while nurses have limited permissions)

## 🎯 How the Solution Addresses the Challenge

The original challenge required a system that allows healthcare workers to perform the following tasks:

### 1. Create a Health Program

Healthcare workers can create new health programs (e.g., TB, Malaria, HIV) through the Programs section.

![Program Creation](public\programCreate.png)

Each program can be configured with:

- Name and code
- Description
- Required fields for enrollment
- Active status

### 2. Register a New Client

The system provides a client registration form to capture comprehensive client information:

![Client Registration](public\registerClient.png)

Client details include:

- Personal information (name, date of birth, gender)
- Contact information (phone, email, address)
- National ID
- Emergency contact information

### 3. Enroll a Client in Programs

Once registered, clients can be enrolled in one or more health programs:

![Client Enrollment](public\enrollClient.png)

The enrollment process captures:

- Enrollment date
- Program-specific data
- Enrollment status (active, completed, suspended)
- Notes

### 4. Search for a Client

The system provides powerful search capabilities to find registered clients:

![Client Search](public\searchClient.png)

Search features include:

- Search by name, ID, or other identifiers
- Filtering options
- Pagination for large result sets

### 5. View Client Profile

Healthcare workers can view a client's complete profile, including all programs they are enrolled in:

![Client Profile](public\clientProfile.png)

The profile displays:

- Personal and contact information
- List of program enrollments
- Enrollment history and status
- Program-specific data

### 6. API for Client Profiles

The system exposes client profiles via a secure API, allowing other healthcare systems to access this information:

![API Access](public\api.png)

API features include:

- Authentication via API keys
- Endpoints for clients and programs
- Comprehensive documentation
- Rate limiting and security measures

## 🔧 Technical Architecture

HealthIS is built using modern web technologies:

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Xata (serverless database)
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel

The architecture follows a modern, component-based approach with server components for data fetching and client components for interactivity.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Xata account for the database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wanjuifavour/Health-System.git
   cd Health-System
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   XATA_API_KEY=your-xata-api-key
   XATA_BRANCH=main
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📚 API Documentation

HealthIS provides a RESTful API for integration with other healthcare systems. The API allows external systems to access client and program data securely.

### Authentication

API requests can be authenticated using one of the following methods:

1. **API Key**: Include an `x-api-key` header with your API key
2. **Session**: Be logged in with a valid user session

### API Keys Management

#### Generate an API Key

```
POST /api/keys
```

Request body:

```json
{
  "owner": "System name or owner name",
  "expiresInDays": 365
}
```

#### List API Keys

```
GET /api/keys
```

#### Revoke an API Key

```
DELETE /api/keys
```

Request body:

```json
{
  "apiKey": "his_a1b2c3d4..."
}
```

### Client Endpoints

#### List Clients

```
GET /api/clients
```

Query parameters:

- `page` - Page number (default: 1)
- `pageSize` - Number of records per page (default: 10)
- `search` - Optional search term

#### Get Client Profile

```
GET /api/clients/:id
```

### Program Endpoints

#### List Programs

```
GET /api/programs
```

#### Get Program Details

```
GET /api/programs/:id
```

### Error Handling

All endpoints return standard HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found

## 🔒 Security Considerations

HealthIS implements several security measures to protect sensitive healthcare data:

- **Authentication**: Secure login with NextAuth.js
- **Authorization**: Role-based access control
- **API Security**: API key authentication and validation
- **Data Encryption**: Secure data transmission with HTTPS
- **Input Validation**: Validation on all user inputs
- **Error Handling**: Secure error handling that doesn't expose sensitive information

## 🚧 Future Enhancements

The following enhancements are planned for future versions:

- **Offline Mode**: Support for offline data collection in areas with poor connectivity
- **Advanced Analytics**: More advanced data visualization and reporting
- **Mobile App**: Dedicated mobile applications for field workers
- **Integration**: More integration options with other healthcare systems
- **Multi-language Support**: Localization for different regions

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework used
- [Xata](https://xata.io/) - The serverless database platform
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [NextAuth.js](https://next-auth.js.org/) - For authentication
- [Vercel](https://vercel.com/) - For hosting
