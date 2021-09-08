module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql2',
        host: env('DB_HOST', 'localhost'),
        port: env.int('DB_PORT', 3306),
        database: env('DB_NAME', 'hammer_strapi'),
        username: env('DB_USERNAME', 'strapi_default_user'),
        password: env('DB_PASSWORD', 'hammer'),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
