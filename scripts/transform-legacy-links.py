#!/usr/bin/env python3
"""Transform <Link legacyBehavior><a style/className>...</a></Link> to modern Next.js Link syntax."""

import re
import os
import glob
import sys


def find_brace_end(s, start):
    """Return index after the closing brace that matches the opening brace at s[start]."""
    if s[start] != '{':
        raise ValueError(f"Expected '{{' at position {start}, got '{s[start]}'")
    depth = 0
    for i in range(start, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                return i + 1
    raise ValueError(f"No matching closing brace found from position {start}")


def transform(content):
    result = []
    i = 0

    while True:
        # All legacyBehavior Links in this codebase end with 'legacyBehavior>'
        lb_pos = content.find('legacyBehavior>', i)
        if lb_pos == -1:
            result.append(content[i:])
            break

        # Find the opening '<Link ' that contains this legacyBehavior
        link_start = content.rfind('<Link ', i, lb_pos)
        if link_start == -1:
            # legacyBehavior not inside a <Link — pass through
            result.append(content[i:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue

        # Append content before this Link tag
        result.append(content[i:link_start])

        link_tag_end = lb_pos + len('legacyBehavior>') - 1  # position of '>'

        # Build the new Link attributes (everything except legacyBehavior)
        link_open_raw = content[link_start:link_tag_end + 1]
        link_inner = link_open_raw[len('<Link '):-1]
        link_inner = re.sub(r'\s*legacyBehavior\s*', ' ', link_inner).strip()

        # Find the <a child element after the Link opening tag
        after_link = link_tag_end + 1
        a_start = content.find('<a ', after_link)
        if a_start == -1 or a_start - link_tag_end > 300:
            result.append(content[link_start:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue

        # Identify the <a> attribute type and extract its value
        a_inner_start = a_start + len('<a ')
        a_peek = content[a_inner_start:a_inner_start + 300].lstrip()

        if a_peek.startswith('style={'):
            # Multi-line/single-line style object — use brace matching
            style_kw = content.find('style={', a_start)
            style_val_start = style_kw + len('style=')
            style_val_end = find_brace_end(content, style_val_start)
            a_attr = 'style=' + content[style_val_start:style_val_end]
            a_close_gt = content.find('>', style_val_end)

        elif a_peek.startswith('className='):
            # Simple className="..." attribute
            cn_match = re.search(r'className="([^"]+)"', content[a_start:a_start + 200])
            if not cn_match:
                result.append(content[link_start:lb_pos + len('legacyBehavior>')])
                i = lb_pos + len('legacyBehavior>')
                continue
            a_attr = f'className="{cn_match.group(1)}"'
            cn_end = a_start + cn_match.end()
            a_close_gt = content.find('>', cn_end)

        else:
            # Unknown attribute pattern — pass through unchanged
            result.append(content[link_start:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue

        if a_close_gt == -1:
            result.append(content[link_start:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue

        # Extract children between <a ...> and </a>
        children_start = a_close_gt + 1
        a_close_tag = content.find('</a>', children_start)
        if a_close_tag == -1:
            result.append(content[link_start:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue

        children = content[children_start:a_close_tag]

        # Find the closing </Link>
        link_end_pos = content.find('</Link>', a_close_tag + len('</a>'))
        if link_end_pos == -1:
            result.append(content[link_start:lb_pos + len('legacyBehavior>')])
            i = lb_pos + len('legacyBehavior>')
            continue
        link_end = link_end_pos + len('</Link>')

        # Format children: preserve JSX structure, strip plain text
        stripped = children.strip()
        is_complex = '<' in stripped  # has nested JSX elements

        final_children = children if is_complex else stripped

        replacement = f'<Link {link_inner} {a_attr}>{final_children}</Link>'
        result.append(replacement)
        i = link_end

    return ''.join(result)


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pages_dir = os.path.join(base, 'pages')
    files = sorted(glob.glob(os.path.join(pages_dir, '*.tsx')))

    total_before = 0
    total_after = 0
    changed_files = 0

    for filepath in files:
        try:
            with open(filepath) as f:
                original = f.read()

            if 'legacyBehavior' not in original:
                continue

            before = original.count('legacyBehavior')
            total_before += before

            transformed = transform(original)
            after = transformed.count('legacyBehavior')
            total_after += after

            if transformed != original:
                with open(filepath, 'w') as f:
                    f.write(transformed)
                changed_files += 1
                print(f'  ✓ {os.path.basename(filepath)}: {before} → {after} legacyBehavior')
            else:
                print(f'  ✗ {os.path.basename(filepath)}: unchanged ({before} occurrences left)')

        except Exception as e:
            print(f'  ERROR {os.path.basename(filepath)}: {e}', file=sys.stderr)
            import traceback
            traceback.print_exc(file=sys.stderr)

    print(f'\nDone: {changed_files} files changed, {total_before} → {total_after} legacyBehavior remaining')


if __name__ == '__main__':
    main()
