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
                        {type: "text", text: `Analyze this image with context:
                        Design Overview: ${designOverview}
                        Text Content to add: ${textContent}

                        Suggest text placement, font style, and color for this text content so that the text styling is consistent with the design overview and is easy to read with this image as the background. Structure your response in the following format: 
                        - **Text Placement**: (suggest placement locations)
                        - **Font Style**: (suggest 3 or 4 font styles with brief explanation)
                        - **Font Color**: (suggest 3 or 4 colors with brief explanation and corresponding hexcode)
                        - **Additional Suggestions**: (any extra tips)

                        Please keep the response concise and well-organized for easy readability.`},
                        {type: "image_url", image_url: {url: `data:image/jpeg;base64,${base64Image}`, detail: "low"}},
                    ],
                },
            ],
        });

        // Get suggestions from OpenAI response
        const rawSuggestions = openaiResponse.choices?.[0]?.message?.content?.trim() || "No suggestions available";

        //Apply formatting to make the response HTML-friendly
        const formattedSuggestions = rawSuggestions.replace(/### /g, "").replace(/\*\*/g, "").replace(/\n/g, "\n");

        res.json({suggestions: formattedSuggestions});
    } catch (error) {
        console.error("Error processing design:", error);
        res.status(500).json({error: "Failed to process design"});
    }
});

export default router;