import { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/utils/cn'

// Block component imports for rich text rendering
import { YoutubeEmbed } from '@/collections/blocks/youtubeEmbed/component'

import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'

/**
 * Props interface for RichText component
 * @param data - Serialized editor state containing rich text content
 * @param enableGutter - Enable container padding and margins
 * @param enableProse - Enable prose styling for content
 */
type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * RichText component for rendering Lexical editor content
 * Supports custom blocks, images, and formatting
 */
export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <RichTextWithoutBlocks
      {...rest}
      converters={jsxConverters}
      className={cn(
        {
          container: enableGutter,
        },
        className,
      )}
    />
  )
}

/**
 * Converts internal document links to proper href paths
 * @param linkNode - Serialized link node from editor
 * @returns Formatted href path for internal navigation
 */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/blog/${slug}` : `/${slug}`
}

// Type definition for supported node types in the editor
type NodeTypes = DefaultNodeTypes

/**
 * Custom JSX converters for rendering rich text nodes
 * Includes support for:
 * - Default text formatting
 * - Internal/external links
 * - Youtube embeds
 * - Media blocks
 */
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    YoutubeEmbed: ({ node }: { node: any }) => <YoutubeEmbed {...node.fields} />,
  },
})
