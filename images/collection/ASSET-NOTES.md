# The Diwali Edit

Source photographs: `C:\Users\user\Downloads\New folder`.
JPEG copies are resized to a maximum 1500-pixel edge. Originals remain untouched.
The collection, about image and corporate banner use the supplied photographs.

## Featured cutout

`diwali-cutout.png` is a transparent background extraction made with the built-in image_gen tool from `diwali-unwrapped.jpg` (source: `WhatsApp Image 2026-09-13 at 6.25.38 PM.jpeg`). The original styled photograph is retained beside the cutout for comparison. This is an AI-assisted edit of the supplied photograph, so consult the original when confirming precise product details.

Final prompt:

> Use case: background-extraction. Edit target: supplied real product photograph. Remove ONLY the surroundings outside the purple rectangular hamper and its contents. Produce a clean product cutout on a genuinely transparent alpha background. Preserve the exact photograph of the purple box, both white flower-shaped brass diyas, green pouch, IRIS lavender carton, Happy Diwali card inside the box, orange snack packet, and shredded filler. Preserve all product details, text, geometry, camera angle and colors unchanged. Remove table, fabric, lamps, flowers and the separate greeting card lying outside the box. Entire box and protruding contents visible, centered with 6 percent transparent breathing room. Do not invent or redraw products. Output transparent PNG for website use.

## Design

The parchment hero uses the transparent hamper, fine circular outlines and plum typography. The plum scroll section gently turns the same hamper while highlighting three details. It becomes a static sequence on screens at or below 760px wide, short viewports, or when reduced motion is requested. No GSAP dependency is required for this sequence.

Generated hamper/video references have been removed from the page. The Mesa kit now leads into a continuous nine-chapter journey directly after the hero at `#mesa-unbox`. A persistent scene opens the box, lifts the contents, follows each item through its own copy chapter, and assembles the complete kit. The source is `mesa-story.js` and `mesa-story.css`. This uses perspective-transformed photographs, not volumetric 3D models. The former isolated Mesa reveal and competing pinned festive section have been removed. Chapter links and a collection skip link provide direct navigation. Reduced-motion users receive normal image-and-copy chapters. Original assets remain in the repository.

Validation: JavaScript syntax, local image references, HTML element nesting, scroll chapter boundaries, mobile fallback and reduced-motion fallback passed. Cutout alpha verified. Browser visual review was unavailable because this session exposed no connected browser.
