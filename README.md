Equipment Lending Portal - Phase 2 (AI-Assisted Refactor) Starter
=================================================================
This package contains the refactored Phase 2 starter code. It includes:
- backend/: improved resolvers, transaction-safe issueRequest, seed script
- frontend/: added request pages, my-requests, admin actions

Run instructions:
1. Start MongoDB locally.
2. Backend:
   cd backend
   npm install
   npm run seed   # creates demo users and equipment
   npm start
3. Frontend:
   cd frontend
   npm install
   npm start
Backend GraphQL: http://localhost:5001/graphql
