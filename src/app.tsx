import { Button, Rows, Text, FormField, MultilineInput } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "styles/components.css";
import { useAddElement } from "utils/use_add_element";
import React, { useState } from "react";
import { requestExport } from "@canva/design";

export const App: React.FC = () => {
  const addElement = useAddElement();
  /*const onClick = () => {
    addElement({
      type: "text",
      children: ["Hello world!"],
    });
  };*/

  const intl = useIntl();

  // State for design overview and text content inputs
  const [designOverview, setDesignOverview] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const apiKey = "REMOVED_API_KEY";


  // Handle input changes
  const handleDesignOverviewChange = (value: string) => {
    setDesignOverview(value);
  };

  const handleTextContentChange = (value: string) => {
    setTextContent(value);
  };

  const handleSubmit = async () => {
    console.log("Design Overview:", designOverview);
    console.log("Text Content:", textContent);
    //console.log(process.env.OPENAI_API_KEY);
    console.log(apiKey);
    try {
      // Open export dialog and request export as JPEG
      const result = await requestExport({
        acceptedFileTypes: ["jpg"],
      });

      if (result.status === "completed" && result.exportBlobs?.length) {
        // If export was successful, log the URL of the exported JPEG
        const exportUrl = result.exportBlobs[0].url;
        console.log("Export successful. JPEG URL:", exportUrl);
        //Placeholder for further processing or API call with exportUrl, designOverview and textContent

        // Send image and inputs to backend for api call beacuase of content security policy
        const response = await fetch("http://localhost:3001/process-design", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exportUrl,
            designOverview,
            textContent,
          }),
        });

        const data = await response.json();
        setSuggestions(data.suggestions);
        console.log("Suggestions from backend:", data.suggestions);
        /*
        // OpenAI API call
        const openaiResponse = await fetch("http://api.openai.com/v1/engines/gpt-4o-mini/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: `Analyze the design with the following context:\nDesign Overview: ${designOverview}\nText Content: ${textContent}\nImage URL: ${exportUrl}\nSuggest a font style and color that would fit well with this design context.`, 
            max_tokens: 100,
            temperature: 0.7,
          }),
        });

        const data = await openaiResponse.json();
        
        if (data.choices && data.choices.length > 0) {
          const suggestionText = data.choices[0].text.trim();
          setSuggestions(suggestionText);
          console.log("Suggestions from OpenAI:", suggestionText);
        } else {
          console.error("No suggestions returned from OpenAI.");
        }
*/
      } else if (result.status === "aborted") {
        console.log("Export was canceled by the user.");
      } else {
        console.error("Export failed or returned an unexpected result:", result);
      }
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          <FormattedMessage
            defaultMessage="
              To make changes to this app, edit the <code>src/app.tsx</code> file,
              then close and reopen the app in the editor to preview the changes.
            "
            description="Instructions for how to make changes to the app. Do not translate <code>src/app.tsx</code>."
            values={{
              code: (chunks) => <code>{chunks}</code>,
            }}
          />
        </Text>

        <FormField
            label="Design Overview"
            description="Label for the design overview input field"
            control={props => 
              <MultilineInput
                placeholder="Describe the design context (e.g., storybook page with a sunny background)"
                value={designOverview}
                onChange={handleDesignOverviewChange}
                {...props}
              />

            }
            
          />
        
        <FormField
            label="Text Content"
            description="Label for the text content input field"
            control={props => 
              <MultilineInput
                placeholder="Enter the text to add to the design (e.g., 'Once upon a time...')"
                value={textContent}
                onChange={handleTextContentChange}
                {...props}
              />

            }
            
          />

        <Button variant="primary" onClick={handleSubmit} stretch>
          {intl.formatMessage({
            defaultMessage: "Submit for Suggestions",
            description:
              "Button text to submit inputs and get suggestions",
          })}
        </Button>

        {suggestions && (
          <Text >
            <strong>Font Style * Color Suggestions:</strong> {suggestions}
          </Text>
        )}
      </Rows>
    </div>
  );
};
