import { Block } from 'payload';

export const YoutubeEmbed: Block = {
  slug: 'YoutubeEmbed',
  imageURL: 'https://cdn.simpleicons.org/youtube/gray',
  imageAltText: '',
  interfaceName: 'YoutubeEmbed',
  labels: {
    singular: 'YouTube Video',
    plural: 'YouTube Videos',
  },
  fields: [
    {
      name: 'videoURL',
      type: 'text',
      required: true,
      label: 'YouTube Video URL',
      validate: (value: string | undefined | null) => {
        if (!value || !value.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
          return 'Please enter a valid YouTube URL';
        }
        return true;
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video Title',
      admin: {
        description: 'Used for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Optional caption to display below the video',
      },
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Video Settings',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay',
          defaultValue: false,
        },
        {
          name: 'startTime',
          type: 'number',
          label: 'Start Time (seconds)',
          min: 0,
          admin: {
            description: 'Start playing from specific time',
          },
        },
      ],
    },
  ],
};
