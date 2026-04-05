// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

// ==========================================
// USER & AUTHENTICATION (Future Structure)
// ==========================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   // Optional if using OAuth (e.g., GitHub/Google)
  
  // Basic Profile Info
  name          String?
  bio           String?
  avatarUrl     String?
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  favorites     Favorite[]
  savedItems    SavedItem[]
  progress      UserProgress[]
}

// ==========================================
// LEARNING CONTENT (Existing Structure)
// ==========================================

model Module {
  id          String   @id @default(uuid()) // e.g., "part-0"
  title       String   // e.g., "Part 0: Foundations"
  order       Int      // For sorting modules
  
  // Relations
  topics      Topic[]
  favorites   Favorite[]
}

model Topic {
  id          String   @id @default(uuid())
  title       String   // e.g., "0.1 Why Kubernetes Exists"
  order       Int      // For sorting topics within a module
  
  // Relations
  moduleId    String
  module      Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  points      Point[]
  savedItems  SavedItem[]
  progress    UserProgress[]
}

model Point {
  id          String   @id @default(uuid())
  content     String   // e.g., "The problem K8s solves"
  order       Int      // For sorting points within a topic
  
  // Relations
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
}

// ==========================================
// USER INTERACTIONS (Favorites, Saved, Progress)
// ==========================================

// For "Liking" or "Favoriting" a whole module
model Favorite {
  id          String   @id @default(uuid())
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  moduleId    String
  module      Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@unique([userId, moduleId]) // A user can only favorite a module once
}

// For "Bookmarking" or "Saving" specific topics/lessons to read later
model SavedItem {
  id          String   @id @default(uuid())
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@unique([userId, topicId]) // A user can only save a specific topic once
}

// For tracking what a user has already read/completed
model UserProgress {
  id          String   @id @default(uuid())
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)

  isCompleted Boolean  @default(false)
  completedAt DateTime?

  @@unique([userId, topicId]) // One progress record per user per topic
}