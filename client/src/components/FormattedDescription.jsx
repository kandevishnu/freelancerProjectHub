import React from 'react';
import { 
  CheckCircle2, 
  Code2, 
  Layers, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Quote 
} from 'lucide-react';

// Formats inline text with bolding support: **bold**
const renderInlineFormatted = (str) => {
  if (!str) return null;
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

// Chooses an icon based on the section title
const getSectionIcon = (title = '') => {
  const lower = title.toLowerCase();
  if (lower.includes('tech') || lower.includes('stack')) return <Code2 size={18} className="text-blue-600" />;
  if (lower.includes('deliverable') || lower.includes('scope')) return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (lower.includes('requirement') || lower.includes('freelancer') || lower.includes('qualification')) return <UserCheck size={18} className="text-indigo-600" />;
  if (lower.includes('feature') || lower.includes('key')) return <Layers size={18} className="text-amber-600" />;
  return <Sparkles size={18} className="text-blue-600" />;
};

const FormattedDescription = ({ content }) => {
  if (!content) {
    return <p className="text-gray-500 italic">No project description provided.</p>;
  }

  // Split into sections using markdown headers (### or ##) even if no preceding newline
  const rawSections = content.split(/(?=(?:^|\s+)#{2,4}\s+)/);

  return (
    <div className="space-y-8 text-gray-800">
      {rawSections.map((section, sIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        let title = null;
        let body = trimmed;

        // Check if starts with ## or ###
        if (/^#{2,4}\s+/.test(trimmed)) {
          const withoutHashes = trimmed.replace(/^#{2,4}\s+/, '');
          // Section title ends at the first newline or first bullet/dash indicator
          const titleEndMatch = withoutHashes.search(/(\r?\n|\s+-\s+|\s+\d+\.\s+)/);
          if (titleEndMatch !== -1) {
            title = withoutHashes.slice(0, titleEndMatch).trim();
            body = withoutHashes.slice(titleEndMatch).trim();
          } else {
            title = withoutHashes.trim();
            body = '';
          }
        }

        // Clean any leading dashes from the body if left by split
        if (body.startsWith('- ')) {
          body = body.slice(2).trim();
        }

        // Check for any closing highlight note (e.g., **I am looking for...**)
        let highlightNote = null;
        const noteMatch = body.match(/\*\*([^*]{35,})\*\*\s*$/);
        if (noteMatch) {
          highlightNote = noteMatch[1].trim();
          body = body.slice(0, noteMatch.index).trim();
        }

        // Extract list items if present
        // 1. Dash-separated items (either newline-separated or inline " - ")
        const dashItems = body
          .split(/(?:\r?\n\s*[-*•]|\s+-\s+)/)
          .map((s) => s.trim().replace(/^[-*•]\s+/, ''))
          .filter(Boolean);

        // 2. Numbered items (either newline-separated "1." or inline " 1. **...")
        const numberedItems = body
          .split(/(?:\r?\n\s*\d+\.|\s+(?=\b\d+\.\s+))/)
          .map((s) => s.trim())
          .filter(Boolean);

        const isTechStack = title && (title.toLowerCase().includes('tech') || title.toLowerCase().includes('stack'));
        const isDeliverables = title && title.toLowerCase().includes('deliverable');
        const isRequirements = title && (title.toLowerCase().includes('requirement') || title.toLowerCase().includes('qualification'));

        return (
          <div key={sIdx} className="space-y-4">
            {title && (
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-200/80 shadow-xs">
                  {getSectionIcon(title)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {renderInlineFormatted(title)}
                </h3>
              </div>
            )}

            {/* Tech Stack rendering: Sleek key-value cards */}
            {isTechStack && dashItems.length > 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashItems.map((item, idx) => {
                  const colonIdx = item.indexOf(':');
                  if (colonIdx !== -1) {
                    const label = item.slice(0, colonIdx).trim();
                    const value = item.slice(colonIdx + 1).trim();
                    return (
                      <div
                        key={idx}
                        className="bg-gray-50/80 hover:bg-white p-3.5 rounded-xl border border-gray-200/80 transition-all shadow-xs"
                      >
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {value}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80 text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            ) : isDeliverables && dashItems.length > 1 ? (
              /* Deliverables rendering: Clean checklist with emerald icons */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dashItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-emerald-50/40 hover:bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80 transition-all text-sm"
                  >
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 leading-snug">
                      {renderInlineFormatted(item)}
                    </span>
                  </div>
                ))}
              </div>
            ) : isRequirements && dashItems.length > 1 ? (
              /* Requirements rendering: Clean checklist with indigo icons */
              <div className="space-y-2.5">
                {dashItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-gray-50/80 hover:bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-sm transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                    <span className="text-gray-800 leading-relaxed">
                      {renderInlineFormatted(item)}
                    </span>
                  </div>
                ))}
              </div>
            ) : numberedItems.length > 2 ? (
              /* Numbered items / Key Features rendering */
              <div className="space-y-3">
                {/* Check if first item was an intro paragraph preceding 1. */}
                {numberedItems.map((item, idx) => {
                  const numMatch = item.match(/^(\d+)\.\s+([\s\S]*)$/);
                  if (numMatch) {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 bg-gray-50/70 hover:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-100 text-sm sm:text-base transition-colors"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5 shadow-xs">
                          {numMatch[1]}
                        </span>
                        <div className="text-gray-800 leading-relaxed flex-1">
                          {renderInlineFormatted(numMatch[2])}
                        </div>
                      </div>
                    );
                  }
                  // Intro text preceding numbered items
                  return (
                    <div
                      key={idx}
                      className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4"
                    >
                      {renderInlineFormatted(item)}
                    </div>
                  );
                })}
              </div>
            ) : dashItems.length > 2 ? (
              /* Generic bullet list */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dashItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-sm"
                  >
                    <ArrowRight size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 leading-snug">
                      {renderInlineFormatted(item)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* Regular body text with paragraphs */
              <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line space-y-3">
                {renderInlineFormatted(body)}
              </div>
            )}

            {/* Highlighted Closing Callout / Client Note */}
            {highlightNote && (
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-3.5 shadow-xs">
                <div className="p-2 rounded-xl bg-white text-blue-600 shadow-xs flex-shrink-0">
                  <Quote size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                    Client Note & Expectation
                  </p>
                  <p className="text-sm sm:text-base font-medium text-blue-950 leading-relaxed">
                    {highlightNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedDescription;
