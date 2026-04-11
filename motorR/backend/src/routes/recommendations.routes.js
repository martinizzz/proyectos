import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get("/:product", (req, res) => {
    try {
        const product = req.params.product;
        // rules path: backend/reglas.json
        // __dirname is backend/src/routes
        const rulesPath = path.join(__dirname, "../../reglas.json");
        
        if (!fs.existsSync(rulesPath)) {
            return res.json({ ok: true, recomends: [] });
        }
        
        const rawData = fs.readFileSync(rulesPath, "utf-8");
        const rules = JSON.parse(rawData);
        
        const sugerencias = [];
        for (const rule of rules) {
            const antecedents = rule.antecedents || [];
            if (antecedents.includes(product)) {
                for (const reqItem of (rule.consequents || [])) {
                    if (!sugerencias.includes(reqItem)) {
                        sugerencias.push(reqItem);
                    }
                }
            }
        }
        
        return res.json({ ok: true, recomends: sugerencias });
    } catch (error) {
        console.error("Error reading recommendations:", error);
        return res.status(500).json({ ok: false, recomends: [] });
    }
});

export default router;
