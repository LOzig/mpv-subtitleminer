/**
 * @param original - The existing sentence
 * @param updated - The new sentence text without tags
 * @returns The updated sentence with HTML tags
 */
export function preserveHtmlTags(original: string, updated: string): string {
  if (!original || !updated) {
    return updated
  }

  // Extract all tagged segments from the original
  const taggedSegments = extractTaggedSegments(original)

  if (taggedSegments.length === 0) {
    return updated.trim()
  }

  let result = updated.trim()

  // For each tagged segment, find and re-wrap in the new text
  for (const segment of taggedSegments) {
    const searchText = segment.innerText.trim()
    if (!searchText) continue

    // Try to find the exact text in the result
    const position = result.indexOf(searchText)
    if (position !== -1) {
      // Reconstruct with the original tag
      const before = result.substring(0, position)
      const after = result.substring(position + searchText.length)
      result = `${before}${segment.openTag}${searchText}${segment.closeTag}${after}`
    }
  }

  return result
}

interface TaggedSegment {
  openTag: string
  closeTag: string
  innerText: string
}

/**
 * Finds all HTML tag pairs and their contents in a string.
 * Handles tags like <b>, <strong>, <span class="...">, etc.
 */
function extractTaggedSegments(text: string): TaggedSegment[] {
  const segments: TaggedSegment[] = []

  // Match opening tag, content, closing tag
  // Group 1: full opening tag, Group 2: tag name, Group 3: inner content
  const pattern = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>([^<]*)<\/\1>/g

  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    const tagName = match[1]
    const openTag = match[0].substring(0, match[0].indexOf('>') + 1)
    const innerText = match[2] ?? ''
    const closeTag = `</${tagName}>`

    segments.push({ openTag, closeTag, innerText })
  }

  return segments
}
