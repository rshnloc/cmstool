import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, safe, resilient markdown parser for standard blog formatting
  const parseMarkdown = (md: string) => {
    if (!md) return '';

    const lines = md.split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks ```
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          html += `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl my-5 overflow-x-auto text-sm font-mono border border-slate-800"><code>${escapeHtml(codeContent.trim())}</code></pre>`;
          inCodeBlock = false;
          codeContent = '';
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        html += `<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3 tracking-tight">${parseInline(line.slice(4))}</h3>`;
        continue;
      }
      if (line.startsWith('## ')) {
        html += `<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight pb-2 border-b border-slate-200">${parseInline(line.slice(3))}</h2>`;
        continue;
      }
      if (line.startsWith('# ')) {
        html += `<h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4 tracking-tight">${parseInline(line.slice(2))}</h1>`;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        html += `<blockquote class="border-l-4 border-sky-500 pl-4 py-1 my-4 italic text-slate-700 bg-sky-50/50 rounded-r">${parseInline(line.slice(2))}</blockquote>`;
        continue;
      }

      // Unordered list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          html += '<ul class="list-disc list-inside space-y-1.5 my-4 text-slate-700 leading-relaxed">';
          inList = true;
        }
        html += `<li>${parseInline(line.slice(2))}</li>`;
        continue;
      } else if (inList) {
        html += '</ul>';
        inList = false;
      }

      // Empty line
      if (line.trim() === '') {
        continue;
      }

      // Paragraph
      html += `<p class="my-4 text-slate-700 leading-relaxed text-base">${parseInline(line)}</p>`;
    }

    if (inList) {
      html += '</ul>';
    }

    return html;
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const parseInline = (text: string) => {
    let result = escapeHtml(text);
    // Bold **text**
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    // Italic *text*
    result = result.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Inline code `code`
    result = result.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-sky-700 font-mono text-xs border border-slate-200">$1</code>');
    // Links [text](url)
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-sky-600 hover:text-sky-700 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
    return result;
  };

  return (
    <div
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};
