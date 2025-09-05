import { describe, it, expect } from 'vitest';
import { processMarkdown, extractImages, validateImageAltText } from './markdown';

describe('processMarkdown', () => {
	it('should convert basic markdown to HTML', () => {
		const markdown = '# Hello World\n\nThis is a **bold** text.';
		const result = processMarkdown(markdown);

		expect(result).toContain('<h1>Hello World</h1>');
		expect(result).toContain('<strong>bold</strong>');
	});

	it('should handle code blocks with syntax highlighting', () => {
		const markdown = '```javascript\nconst hello = "world";\nconsole.log(hello);\n```';
		const result = processMarkdown(markdown);

		expect(result).toContain('class="language-javascript"');
		expect(result).toContain('<pre class="language-javascript">');
	});

	it('should handle code blocks without language specification', () => {
		const markdown = '```\nsome code\n```';
		const result = processMarkdown(markdown);

		expect(result).toContain('<pre><code>');
		expect(result).toContain('some code');
	});

	it('should handle inline code', () => {
		const markdown = 'Use `console.log()` to debug.';
		const result = processMarkdown(markdown);

		expect(result).toContain('<code>console.log()</code>');
	});

	it('should process images with alt text and responsive classes', () => {
		const markdown = '![A beautiful sunset](sunset.jpg)';
		const result = processMarkdown(markdown);

		expect(result).toContain('<img src="sunset.jpg"');
		expect(result).toContain('alt="A beautiful sunset"');
		expect(result).toContain('class="max-w-full h-auto rounded-lg shadow-sm"');
		expect(result).toContain('loading="lazy"');
	});

	it('should process images with title attribute', () => {
		const markdown = '![Sunset](sunset.jpg "Beautiful sunset over the ocean")';
		const result = processMarkdown(markdown);

		expect(result).toContain('alt="Sunset"');
		expect(result).toContain('title="Beautiful sunset over the ocean"');
	});

	it('should handle images without alt text gracefully', () => {
		const markdown = '![](image.jpg)';
		const result = processMarkdown(markdown);

		expect(result).toContain('<img src="image.jpg"');
		expect(result).toContain('alt=""');
	});

	it('should handle empty or invalid input', () => {
		expect(processMarkdown('')).toBe('');
		expect(processMarkdown(null as any)).toBe('');
		expect(processMarkdown(undefined as any)).toBe('');
	});

	it('should handle markdown with links', () => {
		const markdown = '[Visit Google](https://google.com)';
		const result = processMarkdown(markdown);

		expect(result).toContain('<a href="https://google.com">Visit Google</a>');
	});

	it('should handle lists', () => {
		const markdown = '- Item 1\n- Item 2\n- Item 3';
		const result = processMarkdown(markdown);

		expect(result).toContain('<ul>');
		expect(result).toContain('<li>Item 1</li>');
		expect(result).toContain('<li>Item 2</li>');
		expect(result).toContain('<li>Item 3</li>');
	});

	it('should handle blockquotes', () => {
		const markdown = '> This is a quote';
		const result = processMarkdown(markdown);

		expect(result).toContain('<blockquote>');
		expect(result).toContain('This is a quote');
	});

	it('should handle tables (GitHub Flavored Markdown)', () => {
		const markdown = `| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |`;
		const result = processMarkdown(markdown);

		expect(result).toContain('<table>');
		expect(result).toContain('<th>Name</th>');
		expect(result).toContain('<td>John</td>');
	});
});

describe('extractImages', () => {
	it('should extract images with alt text', () => {
		const markdown = '![Alt text](image.jpg) and ![Another image](photo.png)';
		const images = extractImages(markdown);

		expect(images).toHaveLength(2);
		expect(images[0]).toEqual({ alt: 'Alt text', src: 'image.jpg' });
		expect(images[1]).toEqual({ alt: 'Another image', src: 'photo.png' });
	});

	it('should extract images with title attributes', () => {
		const markdown = '![Sunset](sunset.jpg "Beautiful sunset")';
		const images = extractImages(markdown);

		expect(images).toHaveLength(1);
		expect(images[0]).toEqual({
			alt: 'Sunset',
			src: 'sunset.jpg',
			title: 'Beautiful sunset'
		});
	});

	it('should handle images without alt text', () => {
		const markdown = '![](image.jpg)';
		const images = extractImages(markdown);

		expect(images).toHaveLength(1);
		expect(images[0]).toEqual({ alt: '', src: 'image.jpg' });
	});

	it('should handle complex image URLs', () => {
		const markdown = '![Photo](https://example.com/path/to/image.jpg?size=large)';
		const images = extractImages(markdown);

		expect(images).toHaveLength(1);
		expect(images[0].src).toBe('https://example.com/path/to/image.jpg?size=large');
	});

	it('should return empty array when no images found', () => {
		const markdown = 'This is just text with no images.';
		const images = extractImages(markdown);

		expect(images).toHaveLength(0);
	});

	it('should handle mixed content with images', () => {
		const markdown = `# Title
		
Some text here.

![First image](img1.jpg)

More text.

![Second image](img2.png "With title")

End of content.`;

		const images = extractImages(markdown);

		expect(images).toHaveLength(2);
		expect(images[0]).toEqual({ alt: 'First image', src: 'img1.jpg' });
		expect(images[1]).toEqual({ alt: 'Second image', src: 'img2.png', title: 'With title' });
	});
});

describe('validateImageAltText', () => {
	it('should return no errors for images with proper alt text', () => {
		const markdown = '![Proper alt text](image.jpg) ![Another good alt](photo.png)';
		const errors = validateImageAltText(markdown);

		expect(errors).toHaveLength(0);
	});

	it('should return errors for images without alt text', () => {
		const markdown = '![](image.jpg) ![Good alt](photo.png) ![](another.gif)';
		const errors = validateImageAltText(markdown);

		expect(errors).toHaveLength(2);
		expect(errors[0]).toContain('Image 1 (image.jpg) is missing alt text');
		expect(errors[1]).toContain('Image 3 (another.gif) is missing alt text');
	});

	it('should return errors for images with only whitespace alt text', () => {
		const markdown = '![   ](image.jpg) ![	](photo.png)';
		const errors = validateImageAltText(markdown);

		expect(errors).toHaveLength(2);
		expect(errors[0]).toContain('Image 1 (image.jpg) is missing alt text');
		expect(errors[1]).toContain('Image 2 (photo.png) is missing alt text');
	});

	it('should return empty array when no images present', () => {
		const markdown = 'This content has no images.';
		const errors = validateImageAltText(markdown);

		expect(errors).toHaveLength(0);
	});

	it('should handle complex markdown with mixed image alt text quality', () => {
		const markdown = `# Blog Post

![Good description](hero.jpg)

Some content here.

![](missing-alt.png)

More content.

![Another good one](footer.jpg "With title")

![  ](whitespace-only.gif)`;

		const errors = validateImageAltText(markdown);

		expect(errors).toHaveLength(2);
		expect(errors[0]).toContain('Image 2 (missing-alt.png) is missing alt text');
		expect(errors[1]).toContain('Image 4 (whitespace-only.gif) is missing alt text');
	});
});

describe('Advanced Markdown Processing', () => {
	it('should handle nested markdown structures', () => {
		const markdown = `# Main Title

## Subsection

Here's a list with **bold** items:

1. First item with *emphasis*
2. Second item with \`inline code\`
3. Third item with [a link](https://example.com)

> This is a blockquote with **bold text** and \`code\`.

### Code in blockquote

> \`\`\`javascript
> console.log('Hello from blockquote');
> \`\`\``;

		const result = processMarkdown(markdown);

		expect(result).toContain('<h1>Main Title</h1>');
		expect(result).toContain('<h2>Subsection</h2>');
		expect(result).toContain('<h3>Code in blockquote</h3>');
		expect(result).toContain('<ol>');
		expect(result).toContain('<strong>bold</strong>');
		expect(result).toContain('<em>emphasis</em>');
		expect(result).toContain('<code>inline code</code>');
		expect(result).toContain('<a href="https://example.com">a link</a>');
		expect(result).toContain('<blockquote>');
	});

	it('should handle malformed markdown gracefully', () => {
		const malformedMarkdown = `# Unclosed **bold text
		
[Incomplete link](
		
\`\`\`javascript
// Unclosed code block
console.log('test');`;

		const result = processMarkdown(malformedMarkdown);

		// Should still produce some HTML output without throwing errors
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('should preserve HTML entities and special characters', () => {
		const markdown = `# Special Characters

This text contains &amp; entities and <script> tags.

Code: \`const x = 5 < 10 && 10 > 5;\`

> Quote with &copy; symbol`;

		const result = processMarkdown(markdown);

		expect(result).toContain('&amp;');
		expect(result).toContain('<script>'); // marked doesn't escape script tags by default
		expect(result).toContain('&copy;');
		expect(result).toContain('5 &lt; 10 &amp;&amp; 10 &gt; 5');
	});

	it('should handle various programming languages in code blocks', () => {
		const markdown = `# Code Examples

JavaScript:
\`\`\`javascript
const hello = 'world';
\`\`\`

TypeScript:
\`\`\`typescript
interface User {
  name: string;
}
\`\`\`

CSS:
\`\`\`css
.class {
  color: red;
}
\`\`\`

JSON:
\`\`\`json
{
  "key": "value"
}
\`\`\`

Bash:
\`\`\`bash
echo "Hello World"
\`\`\`

Unknown language:
\`\`\`unknownlang
some code here
\`\`\``;

		const result = processMarkdown(markdown);

		expect(result).toContain('class="language-javascript"');
		expect(result).toContain('class="language-typescript"');
		expect(result).toContain('class="language-css"');
		expect(result).toContain('class="language-json"');
		expect(result).toContain('class="language-bash"');
		// Unknown language should fallback to plain code block
		expect(result).toContain('<pre><code>some code here</code></pre>');
	});

	it('should handle edge cases in image processing', () => {
		const markdown = `# Image Edge Cases

Regular image:
![Normal image](image.jpg)

Image with special characters in URL:
![Special](https://example.com/path/to/image-file_name.jpg?param=value&other=123)

Image with Unicode in alt text:
![Emoji 🚀 and special chars: àáâã](unicode.png)

Image with quotes in title:
![Test](image.jpg "Title with 'single' and \\"double\\" quotes")`;

		const result = processMarkdown(markdown);

		expect(result).toContain('alt="Normal image"');
		expect(result).toContain(
			'src="https://example.com/path/to/image-file_name.jpg?param=value&other=123"'
		);
		expect(result).toContain('alt="Emoji 🚀 and special chars: àáâã"');
		expect(result).toContain('class="max-w-full h-auto rounded-lg shadow-sm"');
		expect(result).toContain('loading="lazy"');
	});
});
