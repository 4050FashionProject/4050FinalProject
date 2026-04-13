db = db.getSiblingDB("mydb");

db.createCollection("users");
db.createCollection("posts");

db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

db.posts.createIndex({ image_id: 1 }, { unique: true });
db.posts.createIndex({ creator: 1 });
db.posts.createIndex({ hashtags: 1 });