import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export function MDViewer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  )
}
