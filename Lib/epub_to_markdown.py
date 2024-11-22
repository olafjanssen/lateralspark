import os
import warnings
from ebooklib import epub, ITEM_DOCUMENT
import markdownify

# Suppress specific warnings from the ebooklib
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

def convert_epub_to_markdown(epub_file_path):
    """
    Convert an EPUB file to a Markdown string, removing XML header tags.

    Args:
        epub_file_path (str): The path to the EPUB file.

    Returns:
        str: The converted Markdown string.
    """
    # Check if the file exists
    if not os.path.isfile(epub_file_path):
        raise FileNotFoundError(f"The file {epub_file_path} does not exist.")

    # Load the EPUB file
    book = epub.read_epub(epub_file_path)
    markdown_content = ""

    # Iterate through the items in the EPUB file
    for item in book.get_items_of_type(ITEM_DOCUMENT):
        # Convert HTML content to Markdown
        markdown_content += markdownify.markdownify(item.get_body_content().decode('utf-8'), heading_style=markdownify.ATX) + "\n\n"

    return markdown_content

# Example usage
if __name__ == "__main__":
    epub_path = "Assets/Piqued.epub"  # Update with your EPUB file path
    markdown_output = convert_epub_to_markdown(epub_path)
    
    output_path = "frontend/data/ebook.md"
    with open(output_path, "w") as output_file:
        output_file.write(markdown_output)
    print(f"Markdown output saved to {output_path}")
