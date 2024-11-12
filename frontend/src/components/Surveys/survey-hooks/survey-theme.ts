/* The above code defines a TypeScript module that exports a constant object `SurveyTheme`. This object
contains configuration settings for a survey theme, including core theme properties like name, color
palette, layout settings, and more. It also includes global CSS variables using design tokens for
consistent styling across the survey components. */
// src/styles/SurveyTheme.ts

import { DesignTokens } from './design-tokens';

export const SurveyTheme = {
    // Core theme configuration
    themeName: "layered",
    colorPalette: "light",
    isPanelless: false,
    backgroundImage: "",
    backgroundOpacity: 1,
    backgroundImageAttachment: "scroll",
    backgroundImageFit: "cover",
    width: "100%",
    maxWidth: "800px",
    questionsOnPageMode: "singlePage",
    widthMode: "static",
    showProgressBar: "bottom",
    showTitle: false,
    showDescription: false,

    // Global CSS variables using design tokens
    cssVariables: {
        "--sv-editorpanel-backcolor": DesignTokens.colors.background,
        "--sv-editorpanel-hovercolor": "rgba(0, 122, 255, 0.06)",
        "--sv-corner-radius": DesignTokens.radius.medium,
        "--sv-base-unit": DesignTokens.spacing.base,
        "--sv-general-backcolor": DesignTokens.colors.background,
        "--sv-primary-backcolor": DesignTokens.colors.primary,
        "--sv-container-width": "800px",
        "--sv-container-padding": "20px",
        "--sv-container-margin": "50px auto",
    } as const,

    
    
    // Custom CSS using template literals for variable interpolation
    customCSS: `
        /*************************
         * IMPORT FONTS
         *************************/
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap');

        /*************************
         * GLOBAL STYLES
         *************************/
        body {
            background: ${DesignTokens.colors.background} !important;
            font-family: ${DesignTokens.fonts.primary} !important;
        }

        /* Survey Container */
        .sv-root-modern {
            max-width: var(--sv-container-width);
            margin: var(--sv-container-margin);
            padding: var(--sv-container-padding);
        }

        .sv-layered .sv-header hr {
            display: none !important;
        }


        
        /*************************
         * QUESTION TEXT STYLES
         *************************/
        .sd-title.sd-element__title {
            margin-bottom: 38px !important;
            font-family: ${DesignTokens.fonts.title} !important;
            font-weight: 600 !important;
            color: ${DesignTokens.colors.buttonTextSoft} !important;
        }

        .sv-string-viewer--multiline {
            font-size: 20px !important;
            font-weight: 500 !important;
            line-height: 1.5 !important;
            color: ${DesignTokens.colors.buttonTextSoft} !important;
        }

        /*************************
         * RADIO BUTTON STYLES
         *************************/
        .sd-selectbase__item {
            counter-increment: item;
            margin: 0 0 5px 0;
            padding: 0;
        }

        .sd-selectbase__label::before {
            content: counter(item, upper-alpha);
            margin-right: 8px;
            color: ${DesignTokens.answerOptions.colors.text.secondary};
            font-weight: ${DesignTokens.answerOptions.typography.fontWeight.indicator};
        }

        .sd-selectbase__label {
            display: flex;
            align-items: center;
            width: ${DesignTokens.answerOptions.layout.width};
            padding: ${DesignTokens.answerOptions.layout.padding};
            margin: ${DesignTokens.answerOptions.layout.margin};
            min-height: ${DesignTokens.answerOptions.layout.minHeight};
            border-radius: ${DesignTokens.answerOptions.layout.borderRadius};
            border: ${DesignTokens.answerOptions.layout.borderWidth} solid ${DesignTokens.answerOptions.colors.border.default};
            background: ${DesignTokens.answerOptions.colors.background.default};
            transition: all 0.15s ease-out;
            box-shadow: none;
        }

        .sd-item__decorator.sd-radio__decorator {
            display: none;
        }

        .sd-selectbase__label:hover,
        .sd-selectbase__label:hover .sd-string-viewer {
            border-color: ${DesignTokens.answerOptions.colors.border.hover};
            background: ${DesignTokens.answerOptions.colors.background.hover};
            transform: translateY(-.1px);
        }

        
        .sd-radio__control:checked + .sd-selectbase__label,
        .sd-item--checked .sd-selectbase__label,
        .sd-radio--checked .sd-selectbase__label {
            border-color: ${DesignTokens.answerOptions.colors.border.selected};
            background: ${DesignTokens.answerOptions.colors.background.selected};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Remove margin from last item */
        .sd-selectbase__item:last-child .sd-selectbase__label {
            margin-bottom: 0;
        }

        .sd-selectbase__label .sv-string-viewer {
            font-family: ${DesignTokens.fonts.primary};
            font-size: ${DesignTokens.answerOptions.typography.fontSize};
            font-weight: ${DesignTokens.answerOptions.typography.fontWeight.text};
            color: ${DesignTokens.answerOptions.colors.text.primary};
        }

        /*************************
         * IMAGE PICKER STYLES
         *************************/
        .sd-imagepicker {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 400px;
        }

        .sd-imagepicker__item-decorator {
            width: 100%;
            height: auto;
            padding: 12px;
            background: ${DesignTokens.answerOptions.colors.background.default};
            border-radius: ${DesignTokens.answerOptions.layout.borderRadius};
            border: ${DesignTokens.answerOptions.layout.borderWidth} solid ${DesignTokens.answerOptions.colors.border.default};
            transition: all 0.15s ease-out;
            display: flex;
            align-items: center;
        }
            

        .sd-imagepicker__image {
            width: 48px;
            height: 48px;
            background: background-color: transparent;
            border-radius: ${DesignTokens.answerOptions.layout.borderRadius};
            /* Adjust or remove opacity and filter if needed */
        }

        .sd-imagepicker__item:hover .sd-imagepicker__item-decorator,
        .sd-imagepicker__item--checked .sd-imagepicker__item-decorator {
            border-color: ${DesignTokens.answerOptions.colors.border.hover};
            background: ${DesignTokens.answerOptions.colors.background.hover};
            transform: translateY(-.1px);
        }

        .sd-imagepicker__item--checked .sd-imagepicker__item-decorator {
            border-color: ${DesignTokens.answerOptions.colors.border.selected};
            background: ${DesignTokens.answerOptions.colors.background.selected};
        }

        /*************************
         * MOBILE RESPONSIVENESS
         *************************/
        @media (max-width: 768px) {
            .sv-root-modern {
                padding: ${DesignTokens.spacing.container.mobile};
                margin: 20px auto;
            }
        }

        /*************************
         * NAVIGATION BUTTON STYLES
         *************************/
        .sd-btn {
            border-radius: ${DesignTokens.radius.small};
            padding: ${DesignTokens.spacing.base};
            transition: all 0.2s ease;
            border: 1px solid ${DesignTokens.colors.buttonText}33;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .sd-btn.sd-navigation__next-btn,
        .sd-btn.sd-navigation__prev-btn,
        .sd-btn.sd-navigation__start-btn {
            color: ${DesignTokens.colors.buttonText};
            background: rgba(255, 255, 255, 0.9);
        }

        .sd-btn:hover {
            background: rgba(255, 255, 255, 0.95);
            border-color: ${DesignTokens.colors.buttonText}4D;
        }

        .sd-btn.sd-navigation__complete-btn {
            color: #FFFFFF;
            background: ${DesignTokens.colors.buttonText};
        }

        /*************************
         * LIKERT SCALE STYLES
         *************************/
        .sd-likert__item,
        .sd-rating__item,
        label.sd-rating__item {
            border: ${DesignTokens.answerOptions.layout.borderWidth} solid ${DesignTokens.answerOptions.colors.border.default};
            background: ${DesignTokens.answerOptions.colors.background.default};
            border-radius: ${DesignTokens.answerOptions.layout.borderRadius};
            transition: all 0.15s ease-out;
            box-shadow: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sd-likert__item:hover,
        label.sd-rating__item:hover {
            border-color: ${DesignTokens.answerOptions.colors.border.hover};
            background: ${DesignTokens.answerOptions.colors.background.hover};
            transform: translateY(-.1px);
        }

        .sd-likert__item--selected,
        label.sd-rating__item--selected {
            border-color: ${DesignTokens.answerOptions.colors.border.selected};
            background: ${DesignTokens.answerOptions.colors.background.selected};
        }

        /* Rating Scale Container */
        .sd-rating {
            position: relative;
            padding-bottom: 48px;
            margin-top: 16px;
        }

        /* Rating Scale Numbers Container */
        .sd-rating__items-container {
            display: flex;
            gap: 0px;
            padding: 0;
            margin: 0;
        }

        /* Rating Scale Text Styles */
        .sd-rating__item-text.sd-rating__min-text,
        .sd-rating__item-text.sd-rating__max-text {
            display: block; /* Ensure min and max texts are visible */
            position: absolute;
            bottom: 0px;
            font-size: ${DesignTokens.answerOptions.typography.fontSize};
            color: ${DesignTokens.answerOptions.colors.text.primary};
            background: none;
            border: none;
            padding: 0;
            margin: 0;
        }
            
        

        .sd-rating__item-text.sd-rating__min-text {
            left: 0;
            text-align: left;
        }

        .sd-rating__item-text.sd-rating__max-text {
            right: 0;
            text-align: right;
        }

        /* Hide individual item numbers */
        .sd-rating__item-text {
            display: none; /* Hide all item texts by default */
        }

        /* Ensure min and max texts are not hidden */
        .sd-rating__item-text.sd-rating__min-text,
        .sd-rating__item-text.sd-rating__max-text {
            display: block;
        }

        /* Rating item label */
        label.sd-rating__item {
            width: 48px;
            height: 48px;
            margin: 0 -2px;
        }

        /* Hide individual item numbers */
        .sd-rating__item-text {
            display: none; /* Hide the individual item numbers */
        }

        /* Ensure min and max texts are visible */
        .sd-rating__item-text.sd-rating__min-text,
        .sd-rating__item-text.sd-rating__max-text {
            display: block;
        }

        /* Optional: Hover effects for min and max texts */
        .sd-rating__item-text.sd-rating__min-text:hover,
        .sd-rating__item-text.sd-rating__max-text:hover {
            color: ${DesignTokens.colors.buttonTextSoft}99;
        }

        /* Hide radio input */
        .sd-rating__item input {
            display: none;
        }


        
    `,
} as const;

export type SurveyThemeType = typeof SurveyTheme;

export default SurveyTheme;
