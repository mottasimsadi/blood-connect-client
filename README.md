# BloodConnect - A Lifesaving Blood Donation Platform (Client Side)

BloodConnect is a user-friendly, full-stack MERN application designed to facilitate blood donation activities. It connects donors with those in need, promoting a seamless and efficient process with features for user registration, donation requests, role-based access control, and content management.

---

## 🔗 Live Links
- **Live Website Link:** [Netlify Live Site](https://ph11-assign-12.netlify.app/)


---

### ✨ Key Features of BloodConnect

This platform is packed with features designed for donors, volunteers, and administrators to manage the blood donation process effectively.

*   **Role-Based Dashboards:** The user experience is tailored to the user's role (Donor, Volunteer, or Admin), with each role having a unique dashboard and set of permissions.
*   **Secure Authentication:** Full authentication system using Firebase, including user registration with detailed profiles (blood group, location) and login.
*   **Public Donor Search:** Anyone can visit the public search page to find available donors by filtering based on Blood Group, District, and Upazila.
*   **Public Donation Request Board:** A dedicated public page that displays all currently pending donation requests, encouraging community participation.
*   **Comprehensive Donor Dashboard:** Donors have a personal dashboard to view their recent donation requests, manage all their past requests with filtering and pagination, and create new requests.
*   **Advanced Admin Dashboard:**
    *   **User Management:** Admins can view all users, filter them by status (`active`/`blocked`), and manage them by blocking/unblocking or changing their roles (Donor, Volunteer, Admin). The logged-in admin is safely excluded from this list to prevent self-lockout.
    *   **Donation Request Oversight:** Admins can view and manage *all* donation requests across the platform, with the ability to edit, delete, or update the status of any request.
    *   **Statistical Overview:** The admin dashboard home features a dynamic statistical overview, showing the total number of users, total funds raised, and total donation requests.
*   **Empowered Volunteer Role:** Volunteers share parts of the admin dashboard, allowing them to view all donation requests and manage blog content, acting as trusted community moderators.
*   **Content Management System (CMS):** A full-featured blog system where admins and volunteers can create posts using a rich text editor (`jodit-react`). Admins have the exclusive ability to publish, unpublish, and delete posts.
*   **Integrated Funding & Payment System:** A dedicated funding page where any logged-in user can donate money to the platform via a secure Stripe payment gateway. The page also displays a paginated history of all donations.
*   **Role-Based Access Control (RBAC):** The entire application is built with security in mind. Specialized private routes (`AdminRoute`, `AdminOrVolunteerRoute`) protect sensitive pages, ensuring that users can only access the content and actions appropriate for their role.
*   **Fully Responsive Design:** Every page, including the complex multi-column dashboard layouts, is fully responsive and optimized for mobile, tablet, and desktop views.
*   **Modern Technology Stack:** Built with the MERN stack and enhanced with modern tools like TanStack Query for efficient data fetching, DaisyUI for beautiful components, and SweetAlert2 for user-friendly notifications.

---

### 🛠️ Technology Stack

*   **Framework:** React
*   **Routing:** React Router
*   **State Management & Data Fetching:** TanStack Query (React Query)
*   **UI/Styling:** DaisyUI, Tailwind CSS
*   **Authentication:** Firebase Authentication
*   **HTTP Client:** Axios
*   **Rich Text Editor:** Jodit-React
*   **Icons:** React Icons
*   **Notifications:** SweetAlert2

---

### 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-mottasimsadi
    cd blood-connect-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Stripe configuration keys:
    ```
    VITE_apiKey=your_firebase_api_key
    VITE_authDomain=your_firebase_auth_domain
    VITE_projectId=your_firebase_project_id
    VITE_storageBucket=your_firebase_storage_bucket
    VITE_messagingSenderId=your_firebase_messaging_sender_id
    VITE_appId=your_firebase_app_id

    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173`.