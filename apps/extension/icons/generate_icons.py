from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    # Draw a simple circle in gold
    padding = size * 0.1
    draw.ellipse((padding, padding, size - padding, size - padding), fill="#B8860B")
    img.save(filename)

create_icon(16, "apps/extension/icons/icon16.png")
create_icon(48, "apps/extension/icons/icon48.png")
create_icon(128, "apps/extension/icons/icon128.png")
