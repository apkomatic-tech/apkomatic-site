import { marked } from 'marked';
import Prism from 'prismjs';

// Import additional Prism languages
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

// Configure marked with custom renderer for syntax highlighting and image processing
marked.use({
	renderer: {
		// Custom code block renderer with Prism.js syntax highlighting
		code(token) {
			const code = token.text;
			const language = token.lang;

			if (language && Prism.languages[language]) {
				try {
					const highlighted = Prism.highlight(code, Prism.languages[language], language);
					return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
				} catch (error) {
					console.warn(`Failed to highlight code block with language "${language}":`, error);
				}
			}

			// Fallback to plain code block
			return `<pre><code>${code}</code></pre>`;
		},

		// Custom image renderer with proper alt text handling and responsive classes
		image(token) {
			const href = token.href;
			const title = token.title;
			const text = token.text;
			const altText = text || title || '';
			const titleAttr = title ? ` title="${title}"` : '';

			// Add responsive classes and proper alt text
			return `<img src="${href}" alt="${altText}"${titleAttr} class="max-w-full h-auto rounded-lg shadow-sm" loading="lazy" />`;
		}
	},
	gfm: true, // GitHub Flavored Markdown
	breaks: false, // Don't convert \n to <br>
	pedantic: false
});

/**
 * Process markdown content and convert it to HTML
 * @param content - Raw markdown content
 * @returns Processed HTML string
 */
export function processMarkdown(content: string): string {
	if (!content || typeof content !== 'string') {
		return '';
	}

	try {
		// Process the markdown content
		const html = marked.parse(content) as string;
		return html;
	} catch (error) {
		console.error('Failed to process markdown content:', error);
		// Return escaped content as fallback
		return `<pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
	}
}

/**
 * Extract and process images from markdown content
 * @param content - Raw markdown content
 * @returns Array of image information found in the content
 */
export function extractImages(
	content: string
): Array<{ src: string; alt: string; title?: string }> {
	const images: Array<{ src: string; alt: string; title?: string }> = [];

	// Regex to match markdown images: ![alt](src "title")
	const imageRegex = /!\[([^\]]*)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g;

	let match;
	while ((match = imageRegex.exec(content)) !== null) {
		images.push({
			alt: match[1] || '',
			src: match[2],
			title: match[3] || undefined
		});
	}

	return images;
}

/**
 * Validate that all images in markdown content have proper alt text
 * @param content - Raw markdown content
 * @returns Array of validation errors
 */
export function validateImageAltText(content: string): string[] {
	const errors: string[] = [];
	const images = extractImages(content);

	images.forEach((image, index) => {
		if (!image.alt || image.alt.trim() === '') {
			errors.push(`Image ${index + 1} (${image.src}) is missing alt text`);
		}
	});

	return errors;
}
