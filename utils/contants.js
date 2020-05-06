module.exports = {
  USER_FIELDS_REGULAR: [
    'id',
    'pw_count',
    'email',
    'name'
  ],

  USER_FIELDS_TOKEN: ['id', 'name', 'email', 'pw_count'],

  USER_FIELDS_ADMIN: ['role', 'status'],

  USER_FIELDS_QUERY_EXCLUDES: [
    'pw_count',
    'email',
    'password',
    'createdAt',
    'updatedAt'
  ],
};
