interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string | undefined;
          callback: (response: { credential: string }) => void;
        }) => void;
        prompt: () => void;
      };
    };
  };
  AppleID?: {
    auth: {
      signIn: () => Promise<{
        authorization: {
          id_token?: string;
        };
      }>;
    };
  };
} 