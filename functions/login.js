// functions/login.js

const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://dev-regal:NerdStreet@nerdsofwallstreet.rf2byhq.mongodb.net/test";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { username, password } = JSON.parse(event.body);

  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("AlpacaUser");
    const users = db.collection("userData");

    const user = await users.findOne({ username: username, password: password });

    await client.close();

    if (user) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          apiKey: user.apiKey,
          secretApiKey: user.secretApiKey,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid username or password" }),
      };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
};
