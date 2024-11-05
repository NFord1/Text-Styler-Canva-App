import * as express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/process-design", async (req, res) => {
    

    const { exportUrl, designOverview, textContent } = req.body;

    try {

        // Download the exported design file
        const fileResponse = await fetch(exportUrl);
        if (!fileResponse.ok) {
            return res.status(500).json({error: "Failed to download design file"});
        }

        // Convert image to base64
        const arrayBuffer = await fileResponse.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        // Call OpenAI API
        const openai = new OpenAI({ apiKey: "REMOVED_API_KEY"});
        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {type: "text", text: `Analyze the design with context:\nDesign Overview: ${designOverview}\nText Content: ${textContent}\nSuggest font style and color for this design.`},
                        {type: "image_url", image_url: {url: `data:image/jpeg;base64,${base64Image}`, detail: "low"}},
                    ],
                },
            ],
        });

        const suggestions = openaiResponse.choices?.[0]?.message?.content?.trim() || "No suggestions available";
        res.json({suggestions});
    } catch (error) {
        console.error("Error processing design:", error);
        res.status(500).json({error: "Failed to process design"});
    }
});

export default router;