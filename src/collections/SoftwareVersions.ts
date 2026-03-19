import type { CollectionConfig } from 'payload'

export const SoftwareVersions: CollectionConfig = {
  slug: 'software-versions',
  admin: {
    useAsTitle: 'version',
    group: 'BusFileReader',
    description:
      'Chaque entrée = une version publiée du logiciel. Ajoutez la version, la date, puis uploadez les fichiers (un par plateforme). Cochez "Visible sur le site" pour l\'afficher dans la section Télécharger.',
    defaultColumns: ['version', 'releaseDate', 'isActive'],
  },
  fields: [
    {
      name: 'version',
      type: 'text',
      required: true,
      label: 'Numéro de version',
      admin: {
        description: 'Ex : 0.1.0  —  format semver recommandé (majeur.mineur.patch)',
        placeholder: '0.1.0',
      },
    },
    {
      name: 'releaseDate',
      label: 'Date de publication',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'isActive',
      label: 'Visible sur le site',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Décochez pour masquer cette version sans la supprimer.',
      },
    },
    {
      name: 'changelog',
      label: 'Notes de version',
      type: 'richText',
      localized: true,
    },
    {
      name: 'files',
      label: 'Fichiers téléchargeables',
      type: 'array',
      admin: {
        description:
          'Ajoutez un fichier par plateforme. Uploadez directement le .exe / .msi / .dmg depuis votre machine.',
      },
      fields: [
        {
          name: 'platform',
          label: 'Plateforme',
          type: 'select',
          required: true,
          options: [
            { label: 'Windows — Installateur (.exe)', value: 'windows-exe' },
            { label: 'Windows — MSI (.msi)',           value: 'windows-msi' },
            { label: 'macOS — Image disque (.dmg)',    value: 'macos-dmg' },
            { label: 'macOS — Archive (.app.tar.gz)',  value: 'macos-tar' },
          ],
        },
        {
          // Direct file upload — relates to the Downloads upload collection
          name: 'file',
          label: 'Fichier (upload)',
          type: 'upload',
          relationTo: 'downloads',
          admin: {
            description:
              'Uploadez votre .exe, .msi, .dmg ou .tar.gz directement depuis votre machine.',
          },
        },
        {
          name: 'fileSize',
          label: 'Taille affichée',
          type: 'text',
          admin: {
            description: 'Affiché à côté du bouton. Ex : 12.4 MB',
            placeholder: '12.4 MB',
          },
        },
        {
          name: 'sha256',
          label: 'Hash SHA-256',
          type: 'text',
          admin: {
            description: 'Optionnel — pour vérification d\'intégrité.',
          },
        },
        {
          // Kept in schema to preserve the DB column — hidden from admin UI
          name: 'downloadUrl',
          type: 'text',
          admin: { hidden: true },
        },
        {
          name: 'fileName',
          label: 'Nom du fichier (affiché)',
          type: 'text',
          admin: {
            description:
              'Rempli automatiquement depuis le fichier uploadé. Vous pouvez le personnaliser.',
            placeholder: 'BusFileReader_0.1.0_x64-setup.exe',
          },
        },
      ],
    },
  ],
}
