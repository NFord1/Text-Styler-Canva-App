import * as express from "express";
import OpenAI from "openai";
import "dotenv/config";


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
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {type: "text", text: `Analyze this image with context:\nDesign Overview: ${designOverview}\nText Content: ${textContent}\nSuggest text placement, font style and color for this design so that the text fits well with the design overview and content and is easy to read against the background image.`},
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