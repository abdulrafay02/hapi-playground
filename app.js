const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const Path = require("path");
const mongoose = require("mongoose");
const Task = require("./models/task");

const init = async () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.z7how.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("MongoDB connected...");
    })
    .catch((err) => {
      throw err;
    });

  // Init server
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "public"),
      },
    },
  });

  await server.register(Inert);
  await server.register(Vision);

  // Vision templates
  server.views({
    engines: { html: Handlebars },
    relativeTo: __dirname,
    path: "views",
  });

  // Dynamic routes
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      //return "Hello World!";
      return h.view("index", {
        name: "John Doe",
      });
    },
  });

  server.route({
    method: "GET",
    path: "/tasks",
    handler: async (request, h) => {
      //return "Hello World!";

      try {
        const tasks = await Task.find().lean();
        console.log(tasks);
        return h.view("tasks", {
          tasks,
        });
      } catch (err) {
        throw err;
      }
    },
  });

  // Static routes
  server.route({
    method: "GET",
    path: "/about",
    handler: (request, h) => {
      return h.file("about.html");
    },
  });

  server.route({
    method: "GET",
    path: "/image",
    handler: (request, h) => {
      return h.file("hapi.js.png");
    },
  });

  await server.start();
  console.log(`
  =======================================
  Server running on ${server.info.uri}
  =======================================
  `);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
