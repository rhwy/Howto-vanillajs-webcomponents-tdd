#!/bin/bash
# Build mini-book from article
# Requires: pandoc (brew install pandoc)

cd "$(dirname "$0")"

echo "📚 Building eBook..."

# Build EPUB
pandoc full-article.md \
    -o webcomponentsintddminiebook.epub \
    -s \
    --highlight-style=zenburn \
    --embed-resources \
    --standalone \
    --from=markdown \
    --toc \
    --toc-depth=2 \
    --css=book.css \
    --metadata title="Build Web Components in Vanilla JS" \
    --metadata author="Rui Carvalho (@rhwy)"

echo "✅ Created: webcomponentsintddminiebook.epub"

# Build HTML (for preview)
pandoc full-article.md \
    -o webcomponentsintddminiebook.html \
    -s \
    --highlight-style=zenburn \
    --embed-resources \
    --standalone \
    --from=markdown \
    --toc \
    --toc-depth=2 \
    --css=book.css \
    --metadata title="Build Web Components in Vanilla JS"

echo "✅ Created: webcomponentsintddminiebook.html"

echo ""
echo "📖 Done! Open the HTML to preview or load the EPUB in your reader."
