// src/declarations.d.ts

declare module '@m2c2kit/assessment-color-dots' {
    export class ColorDots {
      constructor(config: {
        containerId: string;
        onComplete: (score: number) => void;
        onLoad: () => void;
        onError?: (error: any) => void;
      });
      start(): void;
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

// Only keep module declarations
declare module "*.json" {
    const value: any;
    export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

// Google OAuth Types
declare namespace google.accounts.id {
  interface PromptNotification {
    isDisplayed(): boolean;
    isNotDisplayed(): boolean;
    isSkippedMoment(): boolean;
    getDismissedReason(): string;
    getMomentType(): string;
  }

  interface GsiButtonConfiguration {
    type: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: string;
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    local?: string;
  }

  interface IdConfiguration {
    client_id: string;
    auto_select?: boolean;
    callback: (response: { credential: string }) => void;
    context?: string;
    ux_mode?: 'popup' | 'redirect';
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: () => void;
  }

  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: IdConfiguration) => void;
          prompt: (notification?: (notification: PromptNotification) => void) => void;
          renderButton: (element: HTMLElement, config: GsiButtonConfiguration) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: { id: string; password: string }, callback: () => void) => void;
          cancel: () => void;
          revoke: (userId: string, callback: () => void) => void;
        };
      };
    };
  }
}

// Ensure this file is treated as a module
export {};

