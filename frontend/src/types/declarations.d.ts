// src/declarations.d.ts

declare module '@m2c2kit-assessment-color-dots' {
    export class ColorDots {
      constructor();
      initialize(): Promise<void>;
      destroy(): void;
      // Add additional methods and properties as needed
      // For example:
      // onGameComplete(callback: (score: number) => void): void;
      // getTrialData(): TrialData[];
    }
  
    interface TrialData {
      // Define the structure based on the game's trial data
      color_selected: {
        color_name: string;
        rgba_color: [number, number, number, number];
      };
      location_selected: {
        x: number;
        y: number;
      };
      // Add other trial data fields as necessary
    }
  }

  
  // src/declarations.d.t

declare module '@m2c2kit/assessment-color-dots' {
  export class ColorDots {
    constructor(config: {
      containerId: string;
      onComplete: (score: number) => void;
      onLoad: () => void;
    });
    start(): void;
  }
}

declare module '@m2c2kit/assessment-color-shapes' {
  export class ColorShapes {
    constructor(config: {
      containerId: string;
      numTrials?: number;
      stimulusDuration?: number;
      fixationDuration?: number;
      feedbackDuration?: number;
      interTrialInterval?: number;
      onComplete?: (result: any) => void;
      onLoad?: () => void;
      onError?: (error: any) => void;
    });
    start(): void;
  }
}

declare module '@m2c2kit/assessment-grid-memory' {
  export class GridMemory {
    constructor(config: {
      containerId: string;
      onComplete: (score: number) => void;
      onLoad: () => void;
      onError?: (error: any) => void;
    });
    start(): void;
  }
}

declare module '@m2c2kit/assessment-symbol-search' {
  export class SymbolSearch {
    constructor(config: {
      containerId: string;
      onComplete: (score: number) => void;
      onLoad: () => void;
      onError?: (error: any) => void;
    });
    start(): void;
  }
}

import { ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonVariant = 
  | "primary"    // Main actions
  | "secondary"  // Alternative actions
  | "success"    // Completion/confirmation actions
  | "warning"    // Cautionary actions
  | "error"      // Destructive/critical actions
  | "info"       // Informational actions
  | "neutral"    // Default/basic actions
  | "outlined"   // Border-only style
  | "text";      // Text-only style

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}