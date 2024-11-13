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

