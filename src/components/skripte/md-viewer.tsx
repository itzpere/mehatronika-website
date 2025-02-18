import ReactMarkdown from 'react-markdown'
export function MDViewer({ content }: { content: string }) {
  return (
    <ReactMarkdown className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
      {content}
    </ReactMarkdown>
  )
}
