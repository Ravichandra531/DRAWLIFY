import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export const middleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && typeof decoded !== "string") {
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
