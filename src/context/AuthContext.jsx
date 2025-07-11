import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [role, setRole] = useState("");
  const [token, setToken] = useState(null);
  const [fname, setFname] = useState("");
  


  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserId = localStorage.getItem("userId");
    const storedAdminId = localStorage.getItem("adminId");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    const storedFname = localStorage.getItem("fname");
    

    console.log("🔍 AuthContext: Retrieved from localStorage", {
      storedIsLoggedIn,
      storedUserId,
      storedAdminId,
      storedRole,
      storedToken,
      storedFname,
    });

    if (storedIsLoggedIn && storedRole && storedToken) {
      setIsLoggedIn(true);
      setRole(storedRole);
      setToken(storedToken);
      setFname(storedFname);

      if (storedRole === "admin") {
        setAdminId(storedAdminId);
      } else {
        setUserId(storedUserId);
      }
    }
  }, []);

  const login = ({ id, userRole, authToken, userFname }) => {
    if (!authToken) {
      console.error("Login Error: Token is undefined!");
      return;
    }

    console.log("✅ Storing Token in AuthContext:", authToken);

    setIsLoggedIn(true);
    setRole(userRole.toLowerCase());
    setToken(authToken);
    setFname(userFname);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole.toLowerCase());
    localStorage.setItem("token", authToken);
    localStorage.setItem("fname", userFname);

    if (userRole === "admin") {
      setAdminId(id);
      localStorage.setItem("adminId", id);
    } else {
      setUserId(id);
      localStorage.setItem("userId", id);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setAdminId(null);
    setRole("");
    setToken(null);
    setFname("");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("fname");

    console.log("🔒 Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, adminId, role, token, fname, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }


        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: "24h" }
        );


        res.status(200).json({
            message: "Login successful",
            token,
            userId: user._id,
            fname: user.fname,
            city: user.city,
            email: user.email,
            role: "user",
            image:user.image,
            

        });
    } catch (e) {
        console.error("Login error:", e.message);
        res.status(500).json({ message: "Error logging in", error: e.message });
    }
};
