export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isHierarchical: boolean;
  allowAutoAdd: boolean;
  isMain: boolean;
  excludeFromSearch: boolean;
  weight?: number;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Term {
  id: string;
  taxonomyId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  count: number;
  metadata?: Record<string, unknown>;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostTerm {
  postId: string;
  termId: string;
  order: number;
  isMain: boolean;
  createdAt: Date;
}

export interface PostTypeTaxonomy {
  id: string;
  postTypeId: string;
  taxonomyId: string;
  required: boolean;
  multiple: boolean;
  createdAt: Date;
}

