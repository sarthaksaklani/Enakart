#!/usr/bin/env python3
from PIL import Image
import sys

def remove_dark_background(input_path, output_path, threshold=50):
    """Remove dark background from image by making dark pixels transparent."""
    # Open the image
    img = Image.open(input_path)

    # Convert to RGBA if not already
    img = img.convert("RGBA")

    # Get pixel data
    data = img.getdata()

    # Create new image data
    new_data = []
    for item in data:
        # If pixel is dark (close to black), make it transparent
        # Check if all RGB values are below threshold
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            # Make it transparent
            new_data.append((255, 255, 255, 0))
        else:
            # Keep the pixel as is
            new_data.append(item)

    # Update image data
    img.putdata(new_data)

    # Save with transparency
    img.save(output_path, "PNG")
    print(f"Background removed successfully! Saved to: {output_path}")

if __name__ == "__main__":
    input_file = "/home/anchit/Downloads/image.png"
    output_file = "/home/anchit/optical-store/public/website-name.png"

    print("Removing dark background...")
    remove_dark_background(input_file, output_file, threshold=50)
