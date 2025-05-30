const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from the `Authorization` header
    if (!token) return res.status(401).send({ message: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify token using `JWTPRIVATEKEY`
        req.user = decoded; // Attach decoded user info to the request object
        next();
        console.log(req.user); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).send({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
