import type { Express, Request, Response } from "express";
import { handleDemoLogin, handleLogin, handleLogout, getCurrentUser } from "./simpleAuth";

export function registerAuthRoutes(app: Express) {
  // Demo Login
  app.post("/api/auth/demo-login", async (req: Request, res: Response) => {
    await handleDemoLogin(req, res);
  });

  // Simple Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    await handleLogin(req, res);
  });

  // Logout
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    await handleLogout(req, res);
  });

  // Get Current User
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const user = await getCurrentUser(req);
    
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });
}

