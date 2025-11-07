import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBudget extends Struct.ComponentSchema {
  collectionName: 'components_shared_budgets';
  info: {
    displayName: 'Budget';
  };
  attributes: {
    attire: Schema.Attribute.Integer;
    communication: Schema.Attribute.Integer;
    floral: Schema.Attribute.Integer;
    food: Schema.Attribute.Integer;
    miscellaneous: Schema.Attribute.Integer;
    photo: Schema.Attribute.Integer;
    venue: Schema.Attribute.Integer;
  };
}

export interface SharedCommunication extends Struct.ComponentSchema {
  collectionName: 'components_shared_communications';
  info: {
    displayName: 'Communication';
  };
  attributes: {
    notes: Schema.Attribute.Text;
  };
}

export interface SharedContent extends Struct.ComponentSchema {
  collectionName: 'components_shared_contents';
  info: {
    displayName: 'Content';
  };
  attributes: {
    navigation: Schema.Attribute.String;
    richText: Schema.Attribute.Blocks;
    text: Schema.Attribute.Text;
  };
}

export interface SharedDrawer extends Struct.ComponentSchema {
  collectionName: 'components_shared_drawers';
  info: {
    displayName: 'Drawer';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    name: Schema.Attribute.String;
    navigation: Schema.Attribute.String;
    tier: Schema.Attribute.Enumeration<['free', 'premium']>;
  };
}

export interface SharedFloralDecor extends Struct.ComponentSchema {
  collectionName: 'components_shared_floral_decors';
  info: {
    displayName: 'Floral Decor';
  };
  attributes: {};
}

export interface SharedLegal extends Struct.ComponentSchema {
  collectionName: 'components_shared_legals';
  info: {
    displayName: 'Legal';
  };
  attributes: {
    eventInsurance: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    purchaseLicense: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    researchLaws: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMusicAndSound extends Struct.ComponentSchema {
  collectionName: 'components_shared_music_and_sounds';
  info: {
    displayName: 'Music And Sound';
  };
  attributes: {
    notes: Schema.Attribute.Text;
    playlists: Schema.Attribute.Component<'shared.playlists', false>;
    sound: Schema.Attribute.Component<'shared.sound', false>;
  };
}

export interface SharedOddsEndsMisc extends Struct.ComponentSchema {
  collectionName: 'components_shared_odds_ends_miscs';
  info: {
    displayName: 'Odds Ends Misc';
  };
  attributes: {
    brideRingPurchased: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    buyPartyFavors: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    decidePartyFavors: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    groomRingPurchased: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    honeymoonPlanned: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
  };
}

export interface SharedOfficial extends Struct.ComponentSchema {
  collectionName: 'components_shared_officials';
  info: {
    displayName: 'Official';
  };
  attributes: {
    meetOfficiant: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    researchVows: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    retainOfficiant: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    writeVows: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedPhotographerAndVideoGrapher
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_photographer_and_video_graphers';
  info: {
    displayName: 'Photographer & VideoGrapher';
  };
  attributes: {
    notes: Schema.Attribute.Text;
  };
}

export interface SharedPlaylists extends Struct.ComponentSchema {
  collectionName: 'components_shared_playlists';
  info: {
    displayName: 'Playlists';
  };
  attributes: {
    bgMusic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    brideEntrance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    dancingPlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    entranceSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    fatherDaughter: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    firstDance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    groomEntrance: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    motherSon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    postCeremonyPlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    preludePlaylist: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    recessionalSong: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    sendOffSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    specialSong: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    weddingParty: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedPostWedding extends Struct.ComponentSchema {
  collectionName: 'components_shared_post_weddings';
  info: {
    displayName: 'Post Wedding';
  };
  attributes: {
    checkRegistry: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    checkVenue: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    dressDecision: Schema.Attribute.Enumeration<
      ['Sell my dress', 'Donate my dress', 'Preserve my dress']
    >;
    finish: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    returnItems: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSound extends Struct.ComponentSchema {
  collectionName: 'components_shared_sounds';
  info: {
    displayName: 'Sound';
  };
  attributes: {
    notes: Schema.Attribute.Text;
    soundSystem: Schema.Attribute.Enumeration<
      [
        "I'm not using a sound system.",
        "Using the Venue's",
        'Renting the equipment',
        'Borrowing the equipment',
      ]
    >;
  };
}

export interface SharedSubCategory extends Struct.ComponentSchema {
  collectionName: 'components_shared_sub_categories';
  info: {
    displayName: 'subCategory';
  };
  attributes: {
    category: Schema.Attribute.String;
    checkBox: Schema.Attribute.Boolean;
    checkBoxValue: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Component<'shared.task-notes', true>;
    tasks: Schema.Attribute.Component<'shared.task', true>;
    text: Schema.Attribute.Text;
  };
}

export interface SharedTask extends Struct.ComponentSchema {
  collectionName: 'components_shared_tasks';
  info: {
    displayName: 'Task';
  };
  attributes: {
    category: Schema.Attribute.String;
    deadlines: Schema.Attribute.JSON;
    extensions: Schema.Attribute.JSON;
    isCompleted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String;
    navigation: Schema.Attribute.String;
    priority: Schema.Attribute.Integer;
    subCategory: Schema.Attribute.String;
  };
}

export interface SharedTaskNotes extends Struct.ComponentSchema {
  collectionName: 'components_shared_task_notes';
  info: {
    displayName: 'Task Notes';
  };
  attributes: {
    placeholder: Schema.Attribute.Text;
  };
}

export interface SharedWeddingPriority extends Struct.ComponentSchema {
  collectionName: 'components_shared_wedding_priorities';
  info: {
    displayName: 'Wedding Priority';
  };
  attributes: {};
}

export interface SharedWeddingWeek extends Struct.ComponentSchema {
  collectionName: 'components_shared_wedding_weeks';
  info: {
    displayName: 'Wedding Week';
  };
  attributes: {
    notes: Schema.Attribute.Text;
  };
}

export interface VenueVenueItems extends Struct.ComponentSchema {
  collectionName: 'components_venue_venue_items';
  info: {
    displayName: 'Venue Items';
  };
  attributes: {
    chairs: Schema.Attribute.Integer;
    danceFloor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    delegation: Schema.Attribute.Boolean;
    notes: Schema.Attribute.Text;
    restrooms: Schema.Attribute.Boolean;
    soundEquipment: Schema.Attribute.Boolean;
    tables: Schema.Attribute.Integer;
    tents: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.budget': SharedBudget;
      'shared.communication': SharedCommunication;
      'shared.content': SharedContent;
      'shared.drawer': SharedDrawer;
      'shared.floral-decor': SharedFloralDecor;
      'shared.legal': SharedLegal;
      'shared.media': SharedMedia;
      'shared.music-and-sound': SharedMusicAndSound;
      'shared.odds-ends-misc': SharedOddsEndsMisc;
      'shared.official': SharedOfficial;
      'shared.photographer-and-video-grapher': SharedPhotographerAndVideoGrapher;
      'shared.playlists': SharedPlaylists;
      'shared.post-wedding': SharedPostWedding;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.sound': SharedSound;
      'shared.sub-category': SharedSubCategory;
      'shared.task': SharedTask;
      'shared.task-notes': SharedTaskNotes;
      'shared.wedding-priority': SharedWeddingPriority;
      'shared.wedding-week': SharedWeddingWeek;
      'venue.venue-items': VenueVenueItems;
    }
  }
}
