
// Grupo #11
// Madelyn Zambrano
//Michelle Salazar
//Juan Mendoza
//Hector Fernandez


// Grupo #10
// Melanie Anchundia 
// Cristina Cedeño
// Daivelyn Pincay 
// Karen Holguin

// Grupo #7
// Nombre de integrantes:
// George Joseph Paredes Carrillo 
// Jhon Luis Pilco Quiroz
// Jandry Jahir Cedeño Mero
// Justin Enrique Morales Bravo


const express = require("express");
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  await client.connect();
  console.log("Connected successfully to MongoDB");
  const db = client.db("projectManagement");
  const projectCollection = db.collection("projects");
  const taskCollection = db.collection("tasks");

  // Mostrar todos los proyectos
  app.get("/projects", async (req, res) => {
    const projects = await projectCollection.find({}).toArray();
    res.send(projects);
  });

  // Añadir un proyecto
  app.post("/addProject", async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send({ error: "All fields are required" });
    }
    await projectCollection.insertOne({ name, description });
    res.send({ success: true });
  });

  // Añadir una tarea
  app.post("/addTask", async (req, res) => {
    const { projectId, title, description, status } = req.body;
    if (!projectId || !title || !description || !status) {
      return res.status(400).send({ error: "All fields are required" });
    }
    await taskCollection.insertOne({
      projectId: new ObjectId(projectId),
      title,
      description,
      status,
    });
    res.send({ success: true });
  });

  // Mostrar todas las tareas de un proyecto
  app.get("/tasks/:projectId", async (req, res) => {
    const { projectId } = req.params;
    const tasks = await taskCollection
      .find({ projectId: new ObjectId(projectId) })
      .toArray();
    res.send(tasks);
  });

  // Actualizar información de una tarea
  app.put("/updateTask", async (req, res) => {
    const { taskId, title, description, status } = req.body;
    if (!taskId || !title || !description || !status) {
      return res.status(400).send({ error: "All fields are required" });
    }
    await taskCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { title, description, status } }
    );
    res.send({ success: true });
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

main().catch(console.error);
