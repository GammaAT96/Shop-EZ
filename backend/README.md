# shopEZ Backend

Node.js + Express API with Prisma and MongoDB.

## Database setup (Prisma + MongoDB)

1. **MongoDB**
   - Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or use a local MongoDB instance.
   - Copy the connection string.

2. **Environment**
   - Copy `.env.example` to `.env`.
   - Set `DATABASE_URL` to your MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/shopez?retryWrites=true&w=majority`).
   - Set `JWT_SECRET` to a secure random string.

3. **Prisma**
   ```bash
   cd backend
   npm install
   npx prisma generate
   ```
   - `prisma generate` creates the Prisma Client from `prisma/schema.prisma`. No migration step for MongoDB; Prisma creates collections when you first write data.

4. **Run**
   ```bash
   npm run dev
   ```

## Collections (MongoDB)

- **User** – auth (username, email, password, usertype)
- **Admin** – banner URL, categories array
- **Product** – title, description, images, sizes, category, gender, price, discount
- **Cart** – user cart items
- **Orders** – placed orders with shipping and status
