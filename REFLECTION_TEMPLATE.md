REFLECTION_TEMPLATE.md
======================
Enhancements using AI

Backend

Expanded GraphQL schema (input types, better queries/mutations).

Implemented issueRequest with Mongoose transactions to atomically decrement availableQty and mark request as ISSUED.

Implemented returnRequest to increment availability safely.

Added seed script (backend/scripts/seed.js) to create demo users and equipment.

Better input validation and authorization checks in resolvers.

Separate MongoDB database name and port for Phase 2.

Frontend

Added pages: Dashboard, My Requests, Request (submit), Admin Requests (approve/issue).

Apollo client points to Phase 2 backend.

Simple role-aware flows (login token must be used — same token format as backend).


Run instructions (quick)

Start MongoDB locally.

Backend:

cd backend

npm install

npm run seed (creates demo users: student@demo.com
 / staff@demo.com
 / admin@demo.com
 all with password password)

npm start

GraphQL endpoint: http://localhost:5001/graphql

Frontend:

cd frontend

npm install

npm start

Open http://localhost:3000