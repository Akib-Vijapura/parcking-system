import connectDB from "@/lib/db";
import generateToken from "@/lib/generateToken";
import User from "@/models/User";

//Connect to MongoDB
connectDB();

export default async function handler(req, res) {
  console.log(`router`);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({
      message: "Please provide all filds",
    });
  }

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
      Token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
