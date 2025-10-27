// Template Configuration
// This file defines feature flags and customization options for the template

export interface TemplateConfig {
  app: {
    name: string;
    description: string;
    author: string;
  };
  features: {
    auth: {
      emailPassword: boolean;
      googleOAuth: boolean;
      appleOAuth: boolean;
    };
    integrations: {
      exampleOAuth: boolean;
      fileUpload: boolean;
    };
    monitoring: {
      sentry: boolean;
      vercelAnalytics: boolean;
    };
    examples: {
      chatMessages: boolean;
      aiRequests: boolean;
      externalAccounts: boolean;
    };
  };
  database: {
    prefix: string;
  };
}

export const defaultConfig: TemplateConfig = {
  app: {
    name: "{{APP_NAME}}",
    description: "{{APP_DESCRIPTION}}",
    author: "{{AUTHOR_NAME}}",
  },
  features: {
    auth: {
      emailPassword: true,
      googleOAuth: true,
      appleOAuth: false,
    },
    integrations: {
      exampleOAuth: true,
      fileUpload: true,
    },
    monitoring: {
      sentry: true,
      vercelAnalytics: true,
    },
    examples: {
      chatMessages: true,
      aiRequests: true,
      externalAccounts: true,
    },
  },
  database: {
    prefix: "{{DATABASE_PREFIX}}",
  },
};

// Helper functions for template customization
export function getConfig(): TemplateConfig {
  return defaultConfig;
}

export function hasFeature(feature: keyof TemplateConfig['features']): boolean {
  return Object.values(defaultConfig.features[feature]).some(Boolean);
}

export function getAppName(): string {
  return defaultConfig.app.name;
}

export function getDatabasePrefix(): string {
  return defaultConfig.database.prefix;
}
