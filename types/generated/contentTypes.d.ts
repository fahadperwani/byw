import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAdviceAdvice extends Struct.CollectionTypeSchema {
  collectionName: 'advices';
  info: {
    description: '';
    displayName: 'Advice';
    pluralName: 'advices';
    singularName: 'advice';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::advice.advice'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    navigation: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    tier: Schema.Attribute.Enumeration<
      ['free', 'premium', 'conditional (free)', 'conditional (premium)']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlterationItemAlterationItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'alteration_items';
  info: {
    displayName: 'Alteration Item';
    pluralName: 'alteration-items';
    singularName: 'alteration-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alteration: Schema.Attribute.Relation<
      'manyToOne',
      'api::alteration.alteration'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isAcquired: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alteration-item.alteration-item'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlterationAlteration extends Struct.CollectionTypeSchema {
  collectionName: 'alterations';
  info: {
    description: '';
    displayName: 'Alteration';
    pluralName: 'alterations';
    singularName: 'alteration';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isBridal: Schema.Attribute.Boolean & Schema.Attribute.Required;
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::alteration-item.alteration-item'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alteration.alteration'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    received: Schema.Attribute.Boolean;
    scheduled: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiArticleArticle extends Struct.CollectionTypeSchema {
  collectionName: 'articles';
  info: {
    description: 'Create your blog content';
    displayName: 'Article';
    pluralName: 'articles';
    singularName: 'article';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<'manyToOne', 'api::author.author'>;
    blocks: Schema.Attribute.DynamicZone<
      ['shared.media', 'shared.quote', 'shared.rich-text', 'shared.slider']
    >;
    category: Schema.Attribute.Relation<'manyToOne', 'api::category.category'>;
    cover: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAttireSectionAttireSection
  extends Struct.CollectionTypeSchema {
  collectionName: 'attire_sections';
  info: {
    description: '';
    displayName: 'Attire Section';
    pluralName: 'attire-sections';
    singularName: 'attire-section';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    accessoriesPurchased: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dresses: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::attire-section.attire-section'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAuthorAuthor extends Struct.CollectionTypeSchema {
  collectionName: 'authors';
  info: {
    description: 'Create authors for your content';
    displayName: 'Author';
    pluralName: 'authors';
    singularName: 'author';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    avatar: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::author.author'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBudgetBudget extends Struct.CollectionTypeSchema {
  collectionName: 'budgets';
  info: {
    displayName: 'Budget';
    pluralName: 'budgets';
    singularName: 'budget';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::budget.budget'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    spent: Schema.Attribute.Component<'shared.budget', false>;
    total: Schema.Attribute.Component<'shared.budget', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiCategoryCategory extends Struct.CollectionTypeSchema {
  collectionName: 'categories';
  info: {
    description: 'Organize your content into categories';
    displayName: 'Category';
    pluralName: 'categories';
    singularName: 'category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::category.category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommunicationContentCommunicationContent
  extends Struct.SingleTypeSchema {
  collectionName: 'communication_contents';
  info: {
    displayName: 'Communication Content';
    pluralName: 'communication-contents';
    singularName: 'communication-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    communicationAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::communication-content.communication-content'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContentContent extends Struct.CollectionTypeSchema {
  collectionName: 'contents';
  info: {
    displayName: 'Content';
    pluralName: 'contents';
    singularName: 'content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heading: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::content.content'
    > &
      Schema.Attribute.Private;
    navigation: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    richText: Schema.Attribute.Blocks;
    text: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDessertDessert extends Struct.CollectionTypeSchema {
  collectionName: 'desserts';
  info: {
    displayName: 'Dessert';
    pluralName: 'desserts';
    singularName: 'dessert';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    beverageNotes: Schema.Attribute.Relation<'oneToOne', 'api::note.note'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dessertNotes: Schema.Attribute.Relation<'oneToOne', 'api::note.note'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::dessert.dessert'
    > &
      Schema.Attribute.Private;
    mealNotes: Schema.Attribute.Relation<'oneToOne', 'api::note.note'>;
    menus: Schema.Attribute.Relation<'oneToMany', 'api::menu.menu'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiDressDress extends Struct.CollectionTypeSchema {
  collectionName: 'dresses';
  info: {
    description: '';
    displayName: 'Dress';
    pluralName: 'dresses';
    singularName: 'dress';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cost: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isBridal: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::dress.dress'> &
      Schema.Attribute.Private;
    note: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    shopAddress: Schema.Attribute.String;
    shopName: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiFloralAndDecorTaskFloralAndDecorTask
  extends Struct.CollectionTypeSchema {
  collectionName: 'floral_and_decor_tasks';
  info: {
    description: '';
    displayName: 'Floral Decor Task';
    pluralName: 'floral-and-decor-tasks';
    singularName: 'floral-and-decor-task';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isDone: Schema.Attribute.Boolean;
    label: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::floral-and-decor-task.floral-and-decor-task'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFloralChecklistFloralChecklist
  extends Struct.CollectionTypeSchema {
  collectionName: 'floral_checklists';
  info: {
    description: '';
    displayName: 'Floral Checklist';
    pluralName: 'floral-checklists';
    singularName: 'floral-checklist';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    designFloralDecor: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::floral-checklist.floral-checklist'
    > &
      Schema.Attribute.Private;
    nonPerishablesConstructed: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    orderLighting: Schema.Attribute.Boolean;
    orderLinens: Schema.Attribute.Boolean;
    orderSupplies: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    perishablesConstructed: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFloralDecorContentFloralDecorContent
  extends Struct.SingleTypeSchema {
  collectionName: 'floral_decor_contents';
  info: {
    displayName: 'Floral Decor Content';
    pluralName: 'floral-decor-contents';
    singularName: 'floral-decor-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    constructFloralDecorAdvice: Schema.Attribute.Component<
      'shared.drawer',
      false
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    decorAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    designFloralDecorAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    floristAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    lightingAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    linensAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::floral-decor-content.floral-decor-content'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    suppliesAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFloralDecorFloralDecor extends Struct.CollectionTypeSchema {
  collectionName: 'floral_decors';
  info: {
    description: '';
    displayName: 'Floral Decor';
    pluralName: 'floral-decors';
    singularName: 'floral-decor';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    constructFloralsDecor: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    decidedLightings: Schema.Attribute.Boolean;
    decideTableClothNeedds: Schema.Attribute.Boolean;
    designFloralsDecor: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::floral-decor.floral-decor'
    > &
      Schema.Attribute.Private;
    orderLighting: Schema.Attribute.Boolean;
    orderLinens: Schema.Attribute.Boolean;
    orderSupplies: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    tableClothCare: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiFloristItemFloristItem extends Struct.CollectionTypeSchema {
  collectionName: 'florist_items';
  info: {
    description: '';
    displayName: 'Florist Item';
    pluralName: 'florist-items';
    singularName: 'florist-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isPurchased: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::florist-item.florist-item'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiGuestAndSeatingGuestAndSeating
  extends Struct.CollectionTypeSchema {
  collectionName: 'guest_and_seatings';
  info: {
    displayName: 'Guest And Seating';
    pluralName: 'guest-and-seatings';
    singularName: 'guest-and-seating';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    createGuestList: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    designSeatingChart: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    finalizeGuestList: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    guestsAddedToList: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::guest-and-seating.guest-and-seating'
    > &
      Schema.Attribute.Private;
    makeSeatingChart: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiGuestListContentGuestListContent
  extends Struct.SingleTypeSchema {
  collectionName: 'guest_list_contents';
  info: {
    displayName: 'Guest List Content';
    pluralName: 'guest-list-contents';
    singularName: 'guest-list-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    guestAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    guestListAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::guest-list-content.guest-list-content'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seatingContent: Schema.Attribute.Blocks;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHelperRoleHelperRole extends Struct.CollectionTypeSchema {
  collectionName: 'helper_roles';
  info: {
    description: '';
    displayName: 'Venue Helper Role';
    pluralName: 'helper-roles';
    singularName: 'helper-role';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    helpers: Schema.Attribute.Relation<
      'manyToMany',
      'api::venue-helper.venue-helper'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::helper-role.helper-role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['venue', 'floral', 'food', 'caterer']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiHomeScreenHomeScreen extends Struct.SingleTypeSchema {
  collectionName: 'home_screens';
  info: {
    displayName: 'Home Screen';
    pluralName: 'home-screens';
    singularName: 'home-screen';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    budgetAdvice: Schema.Attribute.Blocks;
    budgetHigh: Schema.Attribute.Blocks;
    budgetLow: Schema.Attribute.Blocks;
    budgetMedium: Schema.Attribute.Blocks;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::home-screen.home-screen'
    > &
      Schema.Attribute.Private;
    planningAdvice: Schema.Attribute.Blocks;
    publishedAt: Schema.Attribute.DateTime;
    totoListAdvice: Schema.Attribute.Blocks;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weddingAdvice: Schema.Attribute.Blocks;
  };
}

export interface ApiLightingChecklistLightingChecklist
  extends Struct.CollectionTypeSchema {
  collectionName: 'lighting_checklists';
  info: {
    displayName: 'Lighting Checklist';
    pluralName: 'lighting-checklists';
    singularName: 'lighting-checklist';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    decidedLighting: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lighting-checklist.lighting-checklist'
    > &
      Schema.Attribute.Private;
    orderLightingSupplies: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLinensChecklistLinensChecklist
  extends Struct.CollectionTypeSchema {
  collectionName: 'linens_checklists';
  info: {
    displayName: 'Linens Checklist';
    pluralName: 'linens-checklists';
    singularName: 'linens-checklist';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    decidedTablecloths: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    ironedTablecloths: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-and-decor-task.floral-and-decor-task'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::linens-checklist.linens-checklist'
    > &
      Schema.Attribute.Private;
    orderSupplies: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLinkLink extends Struct.CollectionTypeSchema {
  collectionName: 'links';
  info: {
    displayName: 'Link';
    pluralName: 'links';
    singularName: 'link';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    link: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::link.link'> &
      Schema.Attribute.Private;
    navigation: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMealMeal extends Struct.CollectionTypeSchema {
  collectionName: 'meals';
  info: {
    displayName: 'Meal';
    pluralName: 'meals';
    singularName: 'meal';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    foodScheduled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    items: Schema.Attribute.Relation<'oneToMany', 'api::menu-item.menu-item'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::meal.meal'> &
      Schema.Attribute.Private;
    menus: Schema.Attribute.Relation<'oneToMany', 'api::menu.menu'>;
    notes: Schema.Attribute.Relation<'oneToOne', 'api::note.note'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiMenuItemMenuItem extends Struct.CollectionTypeSchema {
  collectionName: 'menu_items';
  info: {
    description: '';
    displayName: 'Menu Item';
    pluralName: 'menu-items';
    singularName: 'menu-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isPurchased: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::menu-item.menu-item'
    > &
      Schema.Attribute.Private;
    menu: Schema.Attribute.Relation<'manyToOne', 'api::menu.menu'>;
    name: Schema.Attribute.String;
    person: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    section: Schema.Attribute.Relation<'manyToOne', 'api::meal.meal'>;
    serving: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMenuMenu extends Struct.CollectionTypeSchema {
  collectionName: 'menus';
  info: {
    description: '';
    displayName: 'Menu';
    pluralName: 'menus';
    singularName: 'menu';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dessert: Schema.Attribute.Relation<'manyToOne', 'api::dessert.dessert'>;
    items: Schema.Attribute.Relation<'oneToMany', 'api::menu-item.menu-item'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::menu.menu'> &
      Schema.Attribute.Private;
    meal: Schema.Attribute.Relation<'manyToOne', 'api::meal.meal'>;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMusicAndOtherMusicAndOther
  extends Struct.CollectionTypeSchema {
  collectionName: 'music_and_others';
  info: {
    displayName: 'Music And Other';
    pluralName: 'music-and-others';
    singularName: 'music-and-other';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::music-and-other.music-and-other'
    > &
      Schema.Attribute.Private;
    music: Schema.Attribute.Relation<'oneToOne', 'api::music.music'>;
    notes: Schema.Attribute.Text;
    others: Schema.Attribute.Relation<
      'oneToOne',
      'api::other-music.other-music'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiMusicAndSoundContentMusicAndSoundContent
  extends Struct.SingleTypeSchema {
  collectionName: 'music_and_sound_contents';
  info: {
    displayName: 'Music And Sound Content';
    pluralName: 'music-and-sound-contents';
    singularName: 'music-and-sound-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::music-and-sound-content.music-and-sound-content'
    > &
      Schema.Attribute.Private;
    musicPlaylistAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    musicSoundAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    publishedAt: Schema.Attribute.DateTime;
    soundAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMusicMusic extends Struct.CollectionTypeSchema {
  collectionName: 'musics';
  info: {
    displayName: 'Music';
    pluralName: 'musics';
    singularName: 'music';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bgMusic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    brideEntrance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dancingPlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    entranceSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    fatherDaughter: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    firstDance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    groomEntrance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::music.music'> &
      Schema.Attribute.Private;
    motherSon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    musicAndOther: Schema.Attribute.Relation<
      'oneToOne',
      'api::music-and-other.music-and-other'
    >;
    notes: Schema.Attribute.Text;
    postCeremonyPlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    preludePlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    recessionalSong: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    sendOffSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    specialSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weddingParty: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ApiNoteNote extends Struct.CollectionTypeSchema {
  collectionName: 'notes';
  info: {
    displayName: 'Note';
    pluralName: 'notes';
    singularName: 'note';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::note.note'> &
      Schema.Attribute.Private;
    note: Schema.Attribute.Text;
    placeholder: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    subCategory: Schema.Attribute.Relation<
      'manyToOne',
      'api::sub-category.sub-category'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiOddsAndEndOddsAndEnd extends Struct.CollectionTypeSchema {
  collectionName: 'odds_and_ends';
  info: {
    displayName: 'Odds And End';
    pluralName: 'odds-and-ends';
    singularName: 'odds-and-end';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    legal: Schema.Attribute.Component<'shared.legal', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::odds-and-end.odds-and-end'
    > &
      Schema.Attribute.Private;
    miscellaneous: Schema.Attribute.Component<'shared.odds-ends-misc', false>;
    notes: Schema.Attribute.Text;
    official: Schema.Attribute.Component<'shared.official', false>;
    postWedding: Schema.Attribute.Component<'shared.post-wedding', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiOddsAndEndsContentOddsAndEndsContent
  extends Struct.SingleTypeSchema {
  collectionName: 'odds_and_ends_contents';
  info: {
    displayName: 'Odds And Ends Content';
    pluralName: 'odds-and-ends-contents';
    singularName: 'odds-and-ends-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    legalAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::odds-and-ends-content.odds-and-ends-content'
    > &
      Schema.Attribute.Private;
    miscAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    oddsEndsAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    officialAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    postWeddingAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiOtherAttireOtherAttire extends Struct.CollectionTypeSchema {
  collectionName: 'other_attires';
  info: {
    displayName: 'Other Attire';
    pluralName: 'other-attires';
    singularName: 'other-attire';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    childrenDresses: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::other-attire.other-attire'
    > &
      Schema.Attribute.Private;
    otherDresses: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiOtherMusicOtherMusic extends Struct.CollectionTypeSchema {
  collectionName: 'other_musics';
  info: {
    displayName: 'Other Music';
    pluralName: 'other-musics';
    singularName: 'other-music';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::other-music.other-music'
    > &
      Schema.Attribute.Private;
    musicAndOther: Schema.Attribute.Relation<
      'oneToOne',
      'api::music-and-other.music-and-other'
    >;
    notes: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    soundSystem: Schema.Attribute.Enumeration<
      [
        "I'm not using a sound system.",
        "Using the Venue's",
        'Renting the equipment',
        'Borrowing the equipment',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiOtpOtp extends Struct.CollectionTypeSchema {
  collectionName: 'otps';
  info: {
    description: '';
    displayName: 'Otp';
    pluralName: 'otps';
    singularName: 'otp';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    code: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    expiresAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::otp.otp'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    verified: Schema.Attribute.Boolean;
  };
}

export interface ApiPaymentPayment extends Struct.CollectionTypeSchema {
  collectionName: 'payments';
  info: {
    displayName: 'Payment';
    pluralName: 'payments';
    singularName: 'payment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    appleId: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    expiry: Schema.Attribute.DateTime;
    googleToken: Schema.Attribute.String & Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment.payment'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    start: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<
      [
        'com.bridalyourway.mobile.staging.lifetime',
        'com.bridalyourway.mobile.staging.monthly',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiPhotoAndVideoContentPhotoAndVideoContent
  extends Struct.SingleTypeSchema {
  collectionName: 'photo_and_video_contents';
  info: {
    displayName: 'Photo And Video Content';
    pluralName: 'photo-and-video-contents';
    singularName: 'photo-and-video-content';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comparePhotoAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    compareVideoAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::photo-and-video-content.photo-and-video-content'
    > &
      Schema.Attribute.Private;
    photoVideoAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    photoVideoFinalAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPhotographerAndVideographerPhotographerAndVideographer
  extends Struct.CollectionTypeSchema {
  collectionName: 'photographer_and_videographers';
  info: {
    displayName: 'Photographer and Videographer';
    pluralName: 'photographer-and-videographers';
    singularName: 'photographer-and-videographer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    areSame: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::photographer-and-videographer.photographer-and-videographer'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    persons: Schema.Attribute.Relation<
      'oneToMany',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
    photographer: Schema.Attribute.Relation<
      'oneToOne',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    videographer: Schema.Attribute.Relation<
      'oneToOne',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
  };
}

export interface ApiPhotographerOrVideographerPhotographerOrVideographer
  extends Struct.CollectionTypeSchema {
  collectionName: 'photographer_or_videographers';
  info: {
    displayName: 'Photographer Or Videographer';
    pluralName: 'photographer-or-videographers';
    singularName: 'photographer-or-videographer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cost: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isPhotographer: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::photographer-or-videographer.photographer-or-videographer'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    section: Schema.Attribute.Relation<
      'manyToOne',
      'api::photographer-and-videographer.photographer-and-videographer'
    >;
    serviceHours: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiPredefinedTaskPredefinedTask
  extends Struct.CollectionTypeSchema {
  collectionName: 'predefined_tasks';
  info: {
    displayName: 'Predefined Task';
    pluralName: 'predefined-tasks';
    singularName: 'predefined-task';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deadline: Schema.Attribute.Date;
    deadlines: Schema.Attribute.JSON;
    dueDate: Schema.Attribute.Date;
    extensions: Schema.Attribute.JSON;
    isCompleted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::predefined-task.predefined-task'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    navigation: Schema.Attribute.String;
    priority: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    subCategory: Schema.Attribute.Relation<
      'manyToOne',
      'api::sub-category.sub-category'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiSubCategorySubCategory extends Struct.CollectionTypeSchema {
  collectionName: 'sub_categories';
  info: {
    displayName: 'SubCategory';
    pluralName: 'sub-categories';
    singularName: 'sub-category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    checkBox: Schema.Attribute.Boolean;
    checkBoxValue: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    label: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sub-category.sub-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Relation<'oneToMany', 'api::note.note'>;
    publishedAt: Schema.Attribute.DateTime;
    tasks: Schema.Attribute.Relation<
      'oneToMany',
      'api::predefined-task.predefined-task'
    >;
    text: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiTaskTemplateTaskTemplate extends Struct.SingleTypeSchema {
  collectionName: 'task_templates';
  info: {
    displayName: 'Task Template';
    pluralName: 'task-templates';
    singularName: 'task-template';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::task-template.task-template'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subCategories: Schema.Attribute.Component<'shared.sub-category', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTaskTask extends Struct.CollectionTypeSchema {
  collectionName: 'tasks';
  info: {
    description: '';
    displayName: 'Task';
    pluralName: 'tasks';
    singularName: 'task';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'Wedding Location',
        'Attire',
        'Decorations & Floral',
        'Food',
        'Guest List',
        'Communication',
        'Photography & Videography',
        'Music and Sound',
        'Odds & Ends',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deadline: Schema.Attribute.Date;
    dueDate: Schema.Attribute.Date;
    isCompleted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::task.task'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    note: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiVenueHelperVenueHelper extends Struct.CollectionTypeSchema {
  collectionName: 'venue_helpers';
  info: {
    description: '';
    displayName: 'Venue-Helper';
    pluralName: 'venue-helpers';
    singularName: 'venue-helper';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cost: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::venue-helper.venue-helper'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    roles: Schema.Attribute.Relation<
      'manyToMany',
      'api::helper-role.helper-role'
    >;
    type: Schema.Attribute.Enumeration<['venue', 'floral', 'caterer', 'food']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiVenueVenue extends Struct.CollectionTypeSchema {
  collectionName: 'venues';
  info: {
    description: '';
    displayName: 'Venue';
    pluralName: 'venues';
    singularName: 'venue';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Schema.Attribute.Text;
    chairs: Schema.Attribute.Integer;
    cost: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hoursOfUse: Schema.Attribute.Integer;
    indoor: Schema.Attribute.Boolean;
    linens: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::venue.venue'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    occupancy: Schema.Attribute.Integer;
    outdoor: Schema.Attribute.Boolean;
    parking: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    restrooms: Schema.Attribute.Boolean;
    setupCleanup: Schema.Attribute.Boolean;
    soundEquipment: Schema.Attribute.Boolean;
    tables: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'manyToOne', 'api::wedding.wedding'>;
  };
}

export interface ApiWedddingWeekWedddingWeek
  extends Struct.CollectionTypeSchema {
  collectionName: 'weddding_weeks';
  info: {
    displayName: 'Weddding Week';
    pluralName: 'weddding-weeks';
    singularName: 'weddding-week';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cleanUpSchedule: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    coOrdinatorDetails: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    coOrdinatorFound: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::weddding-week.weddding-week'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    scheduleTimeline: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weddingDay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    weddingTimeline: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ApiWeddingWeekWeddingWeek extends Struct.SingleTypeSchema {
  collectionName: 'wedding_weeks';
  info: {
    displayName: 'Wedding Week';
    pluralName: 'wedding-weeks';
    singularName: 'wedding-week';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ceremonyOrder: Schema.Attribute.Blocks;
    ceremonyReception: Schema.Attribute.Blocks;
    cleanUp: Schema.Attribute.Blocks;
    coOrdinatorTips: Schema.Attribute.Blocks;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eventsOrder: Schema.Attribute.Blocks;
    eventsOrderAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    lastWeekSchedule: Schema.Attribute.Blocks;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::wedding-week.wedding-week'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rehearsal: Schema.Attribute.Blocks;
    rehearsalAdvice: Schema.Attribute.Component<'shared.drawer', false>;
    rehearsalDinner: Schema.Attribute.Blocks;
    sampleWeddingTimelineAdvice: Schema.Attribute.Component<
      'shared.drawer',
      false
    >;
    timeline1: Schema.Attribute.Blocks;
    timeline2: Schema.Attribute.Blocks;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weddingSetup: Schema.Attribute.Blocks;
    weddingWeekAdvice: Schema.Attribute.Component<'shared.drawer', false>;
  };
}

export interface ApiWeddingWedding extends Struct.CollectionTypeSchema {
  collectionName: 'weddings';
  info: {
    description: '';
    displayName: 'Wedding';
    pluralName: 'weddings';
    singularName: 'wedding';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bridalDress: Schema.Attribute.Relation<'oneToOne', 'api::dress.dress'>;
    bridesMaidDresses: Schema.Attribute.Relation<
      'oneToOne',
      'api::attire-section.attire-section'
    >;
    budget: Schema.Attribute.Relation<'oneToOne', 'api::budget.budget'>;
    communication: Schema.Attribute.Component<'shared.communication', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dessertSection: Schema.Attribute.Relation<
      'oneToOne',
      'api::dessert.dessert'
    >;
    dresses: Schema.Attribute.Relation<'oneToMany', 'api::dress.dress'>;
    floralDecor: Schema.Attribute.Relation<
      'oneToOne',
      'api::floral-decor.floral-decor'
    >;
    floristItems: Schema.Attribute.Relation<
      'oneToMany',
      'api::florist-item.florist-item'
    >;
    groomOutfit: Schema.Attribute.Relation<'oneToOne', 'api::dress.dress'>;
    groomsMenOutfits: Schema.Attribute.Relation<
      'oneToOne',
      'api::attire-section.attire-section'
    >;
    guestAndSeating: Schema.Attribute.Relation<
      'oneToOne',
      'api::guest-and-seating.guest-and-seating'
    >;
    guestCount: Schema.Attribute.Integer;
    helpers: Schema.Attribute.Relation<
      'oneToMany',
      'api::venue-helper.venue-helper'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::wedding.wedding'
    > &
      Schema.Attribute.Private;
    mealSection: Schema.Attribute.Relation<'oneToOne', 'api::meal.meal'>;
    mediaPersons: Schema.Attribute.Relation<
      'oneToMany',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
    mediaSection: Schema.Attribute.Component<
      'shared.photographer-and-video-grapher',
      false
    >;
    musicAndOther: Schema.Attribute.Relation<
      'oneToOne',
      'api::music-and-other.music-and-other'
    >;
    musicAndSound: Schema.Attribute.Component<'shared.music-and-sound', false>;
    notes: Schema.Attribute.Relation<'oneToMany', 'api::note.note'>;
    oddsEnds: Schema.Attribute.Relation<
      'oneToOne',
      'api::odds-and-end.odds-and-end'
    >;
    otherAttires: Schema.Attribute.Relation<
      'oneToOne',
      'api::other-attire.other-attire'
    >;
    photographer: Schema.Attribute.Relation<
      'oneToOne',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
    predefinedTasks: Schema.Attribute.Relation<
      'oneToMany',
      'api::predefined-task.predefined-task'
    >;
    priorities: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    selectedCaterer: Schema.Attribute.Relation<
      'oneToOne',
      'api::venue-helper.venue-helper'
    >;
    selectedVenue: Schema.Attribute.Relation<'oneToOne', 'api::venue.venue'>;
    tasks: Schema.Attribute.Relation<'oneToMany', 'api::task.task'>;
    totalBudget: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    venueItems: Schema.Attribute.Component<'venue.venue-items', false>;
    venues: Schema.Attribute.Relation<'oneToMany', 'api::venue.venue'>;
    videographer: Schema.Attribute.Relation<
      'oneToOne',
      'api::photographer-or-videographer.photographer-or-videographer'
    >;
    weddingDay: Schema.Attribute.Date;
    weddingWeek: Schema.Attribute.Component<'shared.wedding-week', false>;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'users-permissions': {
      advanced: {
        allow_register: true;
        default_role: 'authenticated';
        unique_email: true;
      };
    };
  };
  attributes: {
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dob: Schema.Attribute.String;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    firstName: Schema.Attribute.String;
    googleId: Schema.Attribute.String;
    isOnboardingCompleted: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    isPremium: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lastName: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    payment: Schema.Attribute.Relation<'oneToOne', 'api::payment.payment'>;
    publishedAt: Schema.Attribute.DateTime;
    termsAccepted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wedding: Schema.Attribute.Relation<'oneToOne', 'api::wedding.wedding'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::advice.advice': ApiAdviceAdvice;
      'api::alteration-item.alteration-item': ApiAlterationItemAlterationItem;
      'api::alteration.alteration': ApiAlterationAlteration;
      'api::article.article': ApiArticleArticle;
      'api::attire-section.attire-section': ApiAttireSectionAttireSection;
      'api::author.author': ApiAuthorAuthor;
      'api::budget.budget': ApiBudgetBudget;
      'api::category.category': ApiCategoryCategory;
      'api::communication-content.communication-content': ApiCommunicationContentCommunicationContent;
      'api::content.content': ApiContentContent;
      'api::dessert.dessert': ApiDessertDessert;
      'api::dress.dress': ApiDressDress;
      'api::floral-and-decor-task.floral-and-decor-task': ApiFloralAndDecorTaskFloralAndDecorTask;
      'api::floral-checklist.floral-checklist': ApiFloralChecklistFloralChecklist;
      'api::floral-decor-content.floral-decor-content': ApiFloralDecorContentFloralDecorContent;
      'api::floral-decor.floral-decor': ApiFloralDecorFloralDecor;
      'api::florist-item.florist-item': ApiFloristItemFloristItem;
      'api::guest-and-seating.guest-and-seating': ApiGuestAndSeatingGuestAndSeating;
      'api::guest-list-content.guest-list-content': ApiGuestListContentGuestListContent;
      'api::helper-role.helper-role': ApiHelperRoleHelperRole;
      'api::home-screen.home-screen': ApiHomeScreenHomeScreen;
      'api::lighting-checklist.lighting-checklist': ApiLightingChecklistLightingChecklist;
      'api::linens-checklist.linens-checklist': ApiLinensChecklistLinensChecklist;
      'api::link.link': ApiLinkLink;
      'api::meal.meal': ApiMealMeal;
      'api::menu-item.menu-item': ApiMenuItemMenuItem;
      'api::menu.menu': ApiMenuMenu;
      'api::music-and-other.music-and-other': ApiMusicAndOtherMusicAndOther;
      'api::music-and-sound-content.music-and-sound-content': ApiMusicAndSoundContentMusicAndSoundContent;
      'api::music.music': ApiMusicMusic;
      'api::note.note': ApiNoteNote;
      'api::odds-and-end.odds-and-end': ApiOddsAndEndOddsAndEnd;
      'api::odds-and-ends-content.odds-and-ends-content': ApiOddsAndEndsContentOddsAndEndsContent;
      'api::other-attire.other-attire': ApiOtherAttireOtherAttire;
      'api::other-music.other-music': ApiOtherMusicOtherMusic;
      'api::otp.otp': ApiOtpOtp;
      'api::payment.payment': ApiPaymentPayment;
      'api::photo-and-video-content.photo-and-video-content': ApiPhotoAndVideoContentPhotoAndVideoContent;
      'api::photographer-and-videographer.photographer-and-videographer': ApiPhotographerAndVideographerPhotographerAndVideographer;
      'api::photographer-or-videographer.photographer-or-videographer': ApiPhotographerOrVideographerPhotographerOrVideographer;
      'api::predefined-task.predefined-task': ApiPredefinedTaskPredefinedTask;
      'api::sub-category.sub-category': ApiSubCategorySubCategory;
      'api::task-template.task-template': ApiTaskTemplateTaskTemplate;
      'api::task.task': ApiTaskTask;
      'api::venue-helper.venue-helper': ApiVenueHelperVenueHelper;
      'api::venue.venue': ApiVenueVenue;
      'api::weddding-week.weddding-week': ApiWedddingWeekWedddingWeek;
      'api::wedding-week.wedding-week': ApiWeddingWeekWeddingWeek;
      'api::wedding.wedding': ApiWeddingWedding;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
