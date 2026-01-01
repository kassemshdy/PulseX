export enum ThemeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string;
  version: string;
  author?: string;
  thumbnail?: string;
  status: ThemeStatus;
  settings: ThemeSettings;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeSettings {
  colors?: ColorSettings;
  typography?: TypographySettings;
  layout?: LayoutSettings;
  components?: Record<string, unknown>;
  customCss?: string;
  customJs?: string;
}

export interface ColorSettings {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  link?: string;
  [key: string]: string | undefined;
}

export interface TypographySettings {
  fontFamily?: string;
  headingFont?: string;
  bodyFont?: string;
  fontSize?: {
    base?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  fontWeight?: Record<string, number>;
  lineHeight?: Record<string, number>;
}

export interface LayoutSettings {
  containerWidth?: string;
  gridColumns?: number;
  gridGap?: string;
  breakpoints?: Record<string, string>;
}

export interface ThemeTemplate {
  id: string;
  themeId: string;
  name: string;
  slug: string;
  type: string; // page, post, archive, search, etc.
  description?: string;
  widgets: TemplateWidget[];
  settings?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

import { WidgetDataSourceConfig } from './widget.types';

export interface TemplateWidget {
  id: string;
  widgetId: string;
  zone: string; // header, main, sidebar, footer, etc.
  order: number;
  dataSource?: WidgetDataSourceConfig;
  overrides?: Record<string, unknown>;
}

