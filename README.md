# BudgetWise – Expense Tracker & Budget Advisor

BudgetWise is a modern personal finance management web application designed to help users track expenses, manage budgets, set savings goals, and gain meaningful insights into their spending behavior.

The application emphasizes **simplicity**, **clarity**, and **actionable financial awareness** without requiring complex tools or spreadsheets.

## 🚀 Features

### 🔐 Secure Authentication
- User registration and login with JWT-based authentication
- Protected routes to ensure user-specific financial data privacy

### 💸 Expense and Income Tracking
- Add, edit, and delete transactions
- Support for both income and expense entries
- Categorized transactions (Food, Bills, Salary, Freelance, etc.)
- Clear visual distinction between income and expense entries

### 📊 Budget Management
- Set monthly budgets (overall and category-wise)
- Real-time tracking of spending vs budget
- Automatic calculation of remaining budget and overspending
- Visual breakdown using pie charts and stacked bar charts

### 🎯 Savings Goals
- Create and track multiple savings goals
- Monitor progress towards target amounts
- Deadline-based goal planning

### 📈 Visual Analytics
- Monthly spending trend visualization
- Category-wise spending analysis
- Frontend-based predictive analysis using linear regression
- Smart alerts and suggestions based on spending behavior

### 📄 Data Export
- Export Profile Summary, Transactions, Budgets, and Savings as PDFs
- CSV export for transaction data
- User-selectable export format and content

### 👤 Profile Overview
- Consolidated financial summary
- Income vs expense comparison
- Net balance and savings rate
- Monthly financial performance overview

### 🧠 Smart Insights
- Predicts next month’s spending using historical trends
- Highlights unusual spending behavior
- Generates actionable suggestions such as:
  - Reducing discretionary spending
  - Improving savings habits
  - Budget adjustment recommendations

## 🛠 Tech Stack

### Frontend
- React.js
- Chakra UI (component styling)
- Framer Motion (animations)
- Recharts (data visualization)
- jsPDF & jsPDF-AutoTable (PDF export)

### Backend
- Spring Boot
- Spring Security + JWT
- JPA / Hibernate
- RESTful APIs

### Database
- Relational database (JPA compatible)

## 🧩 Application Modules
- Authentication (Login / Register / Password Reset)
- Dashboard
- Transactions
- Budgets
- Savings Goals
- Insights
- Profile
- Exports

## 🖼 Screenshots

<img width="1845" height="849" alt="dashboard-overview" src="https://github.com/user-attachments/assets/e01ec67f-f3c6-453d-a704-1e86d81ac6db" />
***
<img width="1028" height="757" alt="transactions-panel" src="https://github.com/user-attachments/assets/fff35494-cddb-4843-b08c-e482bc19c39f" />
***
<img width="882" height="617" alt="budget-panel" src="https://github.com/user-attachments/assets/cc475119-72a9-42ea-b4ee-1efee1bf16f5" />
***
<img width="871" height="546" alt="insights-panel" src="https://github.com/user-attachments/assets/d151745a-717f-4327-b240-ca6c060f663e" />

## ▶️ How to Run the Project

### Backend
```bash
./mvnw spring-boot:run
```

### Frontend
```bash
npm install
npm run dev
```

## 🎯 Project Milestones Completed

- ✅ Milestone 1: Authentication & Core Setup
- ✅ Milestone 2: Transactions, Budgets & Savings
- ✅ Milestone 3: Visualizations & Dashboard
- ✅ Milestone 4: Smart Insights & Predictions
- ✅ Milestone 5: Profile & Export Features

## 📌 Key Highlights

- Clean and intuitive UI
- Fully functional without external AI services
- Minimal backend changes, maximum frontend intelligence
- Academic-ready and production-quality structure

## 📜 License
This project is developed for educational purposes.

## 👏 Final Note
BudgetWise demonstrates how modern frontend technologies combined with a clean backend architecture can deliver powerful financial tools with minimal complexity.
