import { useEffect } from 'react';
import { Model } from 'survey-react';  // Changed to survey-core

export const useSurveyLetters = (survey: Model) => {
    useEffect(() => {
        const handler = (sender: any, options: any) => {
            if (options.question.getType() === "radiogroup") {
                const choices = options.htmlElement.querySelectorAll('.sd-selectbase__label');
                const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                choices.forEach((choice: Element, index: number) => {
                    choice.setAttribute('data-letter', letters[index]);
                });
            }
        };

        survey.onAfterRenderQuestion.add(handler);
        return () => survey.onAfterRenderQuestion.remove(handler);
    }, [survey]);
};