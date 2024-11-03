import { Button, Rows, Text, FormField, MultilineInput } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "styles/components.css";
import { useAddElement } from "utils/use_add_element";
import React, { useState } from "react";

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

  // Handle input changes
  const handleDesignOverviewChange = (value: string) => {
    setDesignOverview(value);
  };

  const handleTextContentChange = (value: string) => {
    setTextContent(value);
  };

  const handleSubmit = () => {
    console.log("Design Overview:", designOverview);
    console.log("Text Content:", textContent);
    // Placeholder for the logic to export the design and call the openai API
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
      </Rows>
    </div>
  );
};
