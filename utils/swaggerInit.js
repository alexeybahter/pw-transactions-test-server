module.exports = {
  info: {
    // API informations (required)
    title: 'pw-server-swagger', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'pw-server swagger' // Description (optional)
  },
  openapi: '3.0.0',
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization'
      }
    }
  },
  security: [{ ApiKeyAuth: [] }],
  apis: ['./controllers/*.js'],
  tags: [
    {
      name: 'auth',
      description: 'auth'
    },
    {
      name: 'users',
      description: 'users'
    }
  ]
};
