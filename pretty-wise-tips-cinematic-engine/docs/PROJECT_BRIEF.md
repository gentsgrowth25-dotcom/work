# MASTER PROJECT — PRETTY WISE TIPS CINEMATIC ANIMATION ENGINE

You are building a professional, reusable 2D cinematic animation system for an Instagram brand called PRETTY WISE TIPS.

Read the full specification before implementing.

This is NOT a conventional educational slideshow, a flat SVG explainer, or a generic motion graphics template.

The goal is to produce beautiful, emotionally engaging, cinematic affirmation videos for women using original illustrations in an authentic 1990s Western television cel-animation aesthetic.

The user will supply image references and generated scene illustrations.

Build the animation engine using code, then use it to create our first pilot episode.

---

# 1. CREATIVE DIRECTION

BRAND: Pretty Wise Tips

NICHE:
- Feminine self-improvement
- Self-worth and confidence
- Financial confidence and ambition
- Luxury mindset
- Elegant living
- Personal growth
- Feminine affirmations

TARGET AUDIENCE:
Adult women interested in becoming confident, ambitious, independent, successful, and emotionally secure.

CONTENT EXPERIENCE:
The viewer should feel as though she is watching a short scene from a beautiful vintage animated television series while listening to a powerful personal affirmation.

The video should feel cinematic, aspirational, luxurious, and emotionally satisfying.

Do not create instructional diagrams, numbered-tip slides, generic text presentations, or simplified vector explainers.

---

# 2. MAIN CHARACTER — VISUAL REFERENCE

IMPORTANT: Examine the uploaded airplane-wing reference image carefully.

The brunette woman in that image is the main character design inspiration and the illustration-style anchor.

Create a consistent original recurring character that retains the reference's defining visual language.

CHARACTER FEATURES:

- Adult woman, approximately 25–30 years old.
- Elegant, feminine proportions.
- Warm medium skin tone.
- Dark chestnut-brown hair.
- Voluminous, softly curled vintage hairstyle.
- Distinctive sculpted front hair swoop.
- Expressive almond-shaped eyes.
- Elegant, simplified nose.
- Refined eyebrows.
- Soft red lipstick.
- Pearl earrings.
- Graceful neck and shoulders.
- Sophisticated facial expressions.
- Calm, confident posture.
- Stylish outfits that change appropriately between scenes.

CHARACTER PERSONALITY:

- Self-assured.
- Ambitious.
- Elegant.
- Emotionally composed.
- Feminine.
- Intelligent.
- Sophisticated.
- Confident without appearing arrogant.

CHARACTER CONSISTENCY:

Maintain the same facial proportions, hair silhouette, eye shape, and recognizable features throughout all episodes.

Create a master character reference sheet containing:
- Front view.
- Three-quarter view.
- Side profile.
- Neutral expression.
- Confident smile.
- Thoughtful expression.
- Disappointed expression.
- Closed-eye expression.
- Basic mouth shapes for optional future lip-syncing.

The reference is an aesthetic and character-design guide. Develop an original character rather than tracing or directly copying a copyrighted television frame.

---

# 3. EXACT ANIMATION ART STYLE

PRIMARY REFERENCE:
Authentic traditional 1990s Western television cel animation.

REQUIRED CHARACTERISTICS:

1. Clean, moderately bold dark contour lines.
2. Strong, recognizable character silhouettes.
3. Angular but attractive facial construction.
4. Large areas of flat solid color.
5. Minimal cel shading, generally one shadow tone.
6. Traditional painted-looking backgrounds.
7. Restrained highlights.
8. Natural, slightly muted color treatment.
9. Soft old-television broadcast appearance.
10. Fine analog grain and subtle image softness.

The artwork must look like it was DRAWN for a 1990s animated series.

Do NOT take modern hyper-detailed artwork and merely add a VHS filter.

DO NOT USE:
- 3D character renders.
- Modern anime aesthetics.
- Hyperrealistic skin rendering.
- Overly glossy gradients.
- Excessive lens flares.
- Plastic-looking faces.
- Modern infographic illustrations.
- Generic emoji-style characters.
- Simplistic SVG puppet characters.
- Heavy VHS glitches or excessive scratches.

The animation should resemble a lovingly restored screenshot from a traditionally animated 1990s television production.

---

# 4. CINEMATIC LOCATIONS

Support reusable illustrated environments, including:

- Luxurious penthouses.
- Elegant hotel lobbies.
- Vintage luxury kitchens.
- Sophisticated dressing rooms.
- Beautiful bedrooms.
- Upscale restaurants.
- Grand staircases.
- Executive offices.
- Luxury vehicles.
- City rooftops.
- Glamorous nighttime interiors.

Every environment should follow the same traditional cel-animation style.

The illustrations should have carefully composed foreground, middle-ground and background elements.

Whenever possible, separate these elements into independent transparent layers so they can be animated at different speeds.

---

# 5. TECHNICAL ARCHITECTURE

Use:
- React
- TypeScript
- Remotion
- SVG only for auxiliary graphic elements
- Layered PNG/WebP assets for principal illustrated artwork
- FFmpeg or appropriate compatible rendering utilities where necessary

Create a reusable project rather than a single hardcoded video.

PROJECT STRUCTURE:

src/
  compositions/
  components/
    CinematicScene
    CameraMotion
    ParallaxLayer
    CharacterAnimator
    ExpressionAnimator
    ParticleSystem
    AnimatedCaptions
    SceneTransition
    FilmTexture
  data/
    episodes/
    characterProfiles/
    sceneTimings/
  styles/
    theme
  utils/

public/
  characters/
  backgrounds/
  scenes/
  props/
  audio/

Allow configuration of:
- Episode title.
- Duration.
- Frame rate.
- Scene sequence.
- Images.
- Character assets.
- Camera movements.
- Animation keyframes.
- Captions.
- Voiceover.
- Music.
- Transitions.

Do not require rewriting the application for each episode.

---

# 6. TWO ANIMATION MODES

IMPORTANT: The engine must distinguish between simple illustrations and layered animation-ready assets.

## MODE A — FLATTENED ILLUSTRATIONS

When only a single illustration is provided:

Support:
- Cinematic zoom.
- Camera pan.
- Gentle reframing.
- Scene transitions.
- Global lighting adjustments.
- Film grain.
- Separately added particles.
- Caption animations.
- Animated overlays.

Do not claim that the character is blinking, speaking, walking, or moving independently if the supplied image contains no separate character parts.

Never distort a flattened face to simulate a large head turn.

## MODE B — LAYERED ARTWORK

When layered assets are available:

Support:
- Independent head movement.
- Blinking.
- Subtle mouth animation.
- Eyebrow changes.
- Hair movement.
- Shoulder movement.
- Small hand gestures.
- Body breathing.
- Clothing movement.
- Foreground/background parallax.
- Independent prop movements.

Use layered images, replacement expression sprites, pivots, masking, and keyframed transforms where appropriate.

Character motion must remain subtle and believable.

No rubbery deformation or broken anatomy.

---

# 7. CHARACTER ANIMATION SYSTEM

Build reusable animation controls for:

BLINKING:
- Open-eye sprite.
- Half-closed-eye sprite.
- Closed-eye sprite.
- Natural blink duration.
- Adjustable blink intervals.

FACIAL EXPRESSIONS:
- Neutral.
- Smile.
- Smirk.
- Thoughtful.
- Confident.
- Disappointed.
- Surprised.

HEAD MOVEMENT:
- Very subtle tilt.
- Small vertical movement.
- Natural easing.
- Correct pivot points.

HAIR:
- Gentle secondary movement.
- No exaggerated waving.
- Preserve the original hair silhouette.

HANDS:
- Resting.
- Holding objects.
- Small expressive gestures.
- Adjusting jewelry.
- Reaching toward props.

MOUTH:
Build optional mouth-shape support for future narration synchronization.

Do not automatically create exaggerated talking motion for a voiceover-only affirmation video.

CHARACTER PERFORMANCE:
Use restrained animation, as seen in traditional television cel animation.

A subtle blink, deliberate glance, or elegant hand gesture can be more effective than constant movement.

---

# 8. CINEMATIC CAMERA SYSTEM

Build programmable camera movements.

Include:

SLOW PUSH-IN:
Gradually zoom toward the character's face.

SLOW PULLBACK:
Reveal the luxurious environment.

HORIZONTAL PAN:
Move across an illustrated room.

VERTICAL PAN:
Reveal an elegant outfit or setting.

PARALLAX:
Move foreground and background layers at different speeds where separate assets exist.

CLOSE-UP:
Frame eyes, jewelry, hands, documents, or other meaningful objects.

SMOOTH TRANSITIONS:
Use cuts, gentle dissolves, and motivated camera changes.

Avoid excessive spinning, shaking, and artificial action-camera effects.

Create reusable keyframe settings with configurable easing curves.

---

# 9. OBJECT ANIMATION

Support animated illustrated objects such as:

- Floating banknotes.
- Jewelry.
- Papers and documents.
- Flower petals.
- Curtains.
- Hair accessories.
- Reflections.
- Light particles.
- Moving shadows.

Use actual illustrated assets for primary objects.

Do not replace beautiful objects with basic geometric placeholders in the final render.

Object animation must match the perspective and lighting of the scene.

---

# 10. PREMIUM CAPTION SYSTEM

This is essential.

Create visually elegant animated captions that synchronize with the affirmation narration.

CAPTION DESIGN:
- Bold, elegant typography.
- White or cream text over dark scenes.
- Dark text over light scenes.
- Subtle outlines or shadows for readability.
- Restrained lavender accents reflecting Pretty Wise Tips branding.
- Maximum two lines.
- Short phrases.
- One highlighted keyword where appropriate.

PLACEMENT:
Prefer the middle-to-lower-middle region of the video.

Keep captions inside Instagram-safe areas.

Do not cover the character's eyes, face, or essential action.

Allow scene-specific caption positioning.

ANIMATION:
- Subtle fade-in.
- Gentle scale-in.
- Smooth upward motion.
- Word-by-word highlight.
- Phrase replacement.
- Precise editable timing.

Use one consistent caption style across the entire series.

VOICEOVER WORKFLOW:

The user creates visuals FIRST.

The user then creates narration through ElevenLabs.

Support importing the completed narration file afterward.

Once audio is imported:
- Allow precise caption synchronization.
- Support word-level timestamp data.
- Allow manual timing corrections.
- Export the video with synchronized captions.

Before audio is supplied, use estimated caption timings and label them as provisional.

Never pretend captions are accurately synchronized to audio that has not been provided.

---

# 11. AUDIO

Support:
- ElevenLabs voiceover imports.
- Optional licensed background music.
- Adjustable volume.
- Fade-in and fade-out.
- Audio synchronization with scenes.

Keep the affirmation narration clearly audible.

Do not generate an artificial narrator.

Do not require music in order to render a silent preview.

---

# 12. FILM AND BROADCAST TEXTURE

Add optional subtle effects:

- Fine analog grain.
- Very light softness.
- Slight color bleed.
- Muted traditional color reproduction.
- Gentle broadcast-era texture.

The result should feel like traditional 1990s animation.

Avoid:
- Heavy VHS glitches.
- Excessive scratches.
- Strong chromatic aberration.
- Artificial film burns.
- Severe image degradation.

These effects must be optional and configurable.

---

# 13. FIRST PILOT VIDEO

TITLE:
I'm Not Waiting to Be Chosen

DURATION:
24 seconds as the initial target.

FORMAT:
9:16 vertical.
1080 × 1920.
30 FPS.

THEME:
Feminine self-worth, ambition, independence, elegance and confidence.

EMOTIONAL DIRECTION:
Quiet confidence rather than aggressive motivation.

VOICEOVER REFERENCE:

"I don't wait for someone to tell me I'm worthy.

I know what I bring into every room.

I can admire beautiful things without forgetting my own value.

I prepare for opportunities instead of begging for attention.

I am allowed to want more.

And every day, I become the woman I once imagined."

Create seven visual scenes:

SCENE 1 — 0:00–0:03
A glamorous brunette enters an elegant hotel lobby.

Begin with a close-up of her heels stepping onto the polished floor.

Cut to her confident expression.

SCENE 2 — 0:03–0:06
The brunette approaches a large mirror in a beautiful dressing room.

She straightens her posture and admires her reflection.

SCENE 3 — 0:06–0:09
She walks confidently into an upscale meeting room.

Show her composed expression, elegant clothing, and confident movement.

SCENE 4 — 0:09–0:12
Close-up of elegant jewelry and luxurious accessories on a dressing table.

She calmly chooses an accessory and puts it on.

SCENE 5 — 0:12–0:16
She sits at an executive desk, reviewing plans and documents.

Use a subtle push-in toward her determined expression.

SCENE 6 — 0:16–0:20
She stands overlooking a beautiful city skyline from a luxurious penthouse.

Curtains and hair move slightly in the breeze.

SCENE 7 — 0:20–0:24
Final confident close-up.

She looks toward the camera with a subtle smile.

Finish with the caption:

"I AM BECOMING HER."

The final shot should feel elegant, aspirational and emotionally satisfying.

These are initial visual timings. Adjust once the actual ElevenLabs narration is available.

---

# 14. SCENE ARTWORK REQUIREMENTS

Do not attempt to recreate all detailed character artwork using simple SVG geometry.

Use pre-generated illustrations supplied by the user.

If some scene illustrations are missing:

1. Create the required project structure.
2. Generate a clear asset manifest describing exactly what illustration is needed.
3. Use marked placeholders only during development.
4. Do not describe placeholders as completed cinematic artwork.
5. Allow the user to replace placeholders without changing the animation logic.

Each scene should support:
- Full-frame background image.
- Optional foreground layer.
- Optional separate character layer.
- Optional character expression sprites.
- Optional props.
- Camera animation.
- Caption timing.
- Scene duration.

Support vertical illustration assets without stretching them.

For landscape references, use appropriate cropping, reframing, or newly illustrated vertical compositions.

---

# 15. QUALITY CONTROL

Before rendering, verify:

- The original 1990s cel-animation aesthetic is preserved.
- Character identity remains consistent.
- No modern infographic characters appear.
- Scene images are not distorted.
- Parallax is applied only where appropriate layers exist.
- Character motion remains anatomically plausible.
- Captions are readable.
- Captions do not cover important details.
- Audio remains optional for silent previews.
- Video dimensions are correct.
- Frame rate is 30 FPS.
- Scene transitions are smooth.
- No unintended blank frames appear.
- No missing assets are silently ignored.

---

# 16. FINAL DELIVERABLES

Create:

1. A fully functioning Remotion project.
2. A reusable animation engine.
3. A character asset specification.
4. A scene asset manifest.
5. A configurable episode data structure.
6. A reusable caption system.
7. A silent preview of the pilot episode when sufficient assets are available.
8. A video rendering workflow.
9. Instructions for importing ElevenLabs narration.
10. Instructions for producing future episodes.

Use the existing repository when appropriate.

Test the build and rendering commands.

Do not claim to have generated character animation that requires missing image layers.

If the user has supplied only flattened artwork, render the supported camera and scene effects, and clearly identify which additional assets would enable character movement.

The long-term goal is to create a repeatable system capable of producing premium cinematic affirmation videos without rebuilding the entire project for every episode.

START BY INSPECTING THE UPLOADED REFERENCES AND EXISTING PROJECT, THEN BUILD THE REUSABLE ENGINE.