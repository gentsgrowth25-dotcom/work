"""Optional local forced-alignment tool; requires pocketsphinx==5.1.1 and FFmpeg.
Run from pretty-wise-tips/: python3 scripts/align-episode07.py
This emits estimated words. Inspect them before editing narrationTiming.json.
"""
from pathlib import Path
import json
import re
import subprocess
import tempfile
import wave
from pocketsphinx import Decoder

root = Path(__file__).resolve().parents[1]
episode = root / 'episodes/07-worth'
text = (episode / 'voiceover-script.txt').read_text().lower()
text = text.replace('’', "'")
text = ' '.join(re.sub(r"[^a-z' ]", ' ', text).split())
with tempfile.TemporaryDirectory() as temp:
    wav = Path(temp) / 'voiceover.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(root / 'public/episode07/voiceover.mp3'),
                    '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', str(wav)], check=True)
    with wave.open(str(wav), 'rb') as audio:
        data = audio.readframes(audio.getnframes())
    decoder = Decoder(samprate=16000, logfn=str(Path(temp) / 'alignment.log'))
    missing = [word for word in set(text.split()) if not decoder.lookup_word(word)]
    if missing:
        raise ValueError(f'Pronunciations required: {missing}')
    decoder.set_align_text(text)
    decoder.start_utt()
    decoder.process_raw(data, full_utt=True)
    decoder.end_utt()
    words = [{'word': word.word, 'start': round(word.start_frame / 100, 2),
              'end': round((word.end_frame + 1) / 100, 2), 'prob': word.prob}
             for word in decoder.seg()]
(episode / 'word-alignment.json').write_text(json.dumps({
    'method': 'Local PocketSphinx 5.1.1 forced alignment to provided transcript; estimates requiring review',
    'words': words}, indent=2) + '\n')
print('Wrote word-alignment.json. Inspect phrase anchors and edit public/episode07/narrationTiming.json.')
