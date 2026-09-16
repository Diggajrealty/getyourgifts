import os
import urllib.request

os.makedirs('images/brands', exist_ok=True)
logos = {
    'anil': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C1-150x150.webp',
    'assetz': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C2-150x150.webp',
    'equitas': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C3-150x150.webp',
    'karle': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C4-150x150.webp',
    'mittal': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C5-150x150.webp',
    'label': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/C6-150x150.webp',
    'nambiar': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g7-scaled.webp',
    'neeta': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g8-scaled.webp',
    'neokred': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g6-scaled.webp',
    'tara': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g5-scaled.webp',
    'sightsee': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g4-scaled.webp',
    'melzer': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g3-scaled.webp',
    'workshaala': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/Workshaala-Logo-Black.webp',
    'upliance': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/PNG-blue-upliance.webp',
    'factsuite': 'https://getyourgiftsonline.com/wp-content/uploads/2023/10/factsuite-logo.jpg',
    'blissclub': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g14-scaled.webp',
    'karan': 'https://getyourgiftsonline.com/wp-content/uploads/2025/06/g9-scaled.webp'
}

for name, url in logos.items():
    ext = url.split('.')[-1]
    urllib.request.urlretrieve(url, f'images/brands/{name}.{ext}')
    print(f'Downloaded {name}')
