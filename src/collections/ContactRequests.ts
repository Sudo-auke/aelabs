import type { CollectionConfig } from 'payload'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Demande de devis', value: 'quote' },
        { label: 'Information', value: 'info' },
        { label: 'Partenariat', value: 'partnership' },
        { label: 'Support', value: 'support' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'solutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'En cours', value: 'in-progress' },
        { label: 'Fermé', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
