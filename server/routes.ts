import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch the sample graph data
  app.get('/api/graph/sample', (req, res) => {
    try {
      const filePath = path.resolve(process.cwd(), 'attached_assets/Pasted--meta-title-Sample-Knowledge-Graph-description-A-sample-knowledge-graph-1746602663733.txt');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      res.json(jsonData);
    } catch (error) {
      console.error('Error reading sample graph data:', error);
      res.status(500).json({ error: 'Failed to load sample graph data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
