import type { CollectionConfig } from 'payload'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Logiciel embarqué', value: 'embedded-software' },
        { label: "Outils d'ingénierie", value: 'engineering-tools' },
        { label: 'Hardware', value: 'hardware' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'specifications',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'value', type: 'text', localized: true },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'text', localized: true },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'datasheet',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
