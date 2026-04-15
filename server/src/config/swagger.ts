import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Haulr API",
      version: "1.0.0",
      description: "API documentation for Haulr logistics platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  },
  // Path to your API routes
  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
