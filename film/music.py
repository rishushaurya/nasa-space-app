# Homeward | film/music.py | v1.0.0 | 2026-11-14
# Writes the film's original music bed with MusicGen (Meta, facebook/musicgen-medium, CC BY-NC 4.0) on this machine's GPU.
# Usage: <venv with torch, transformers<5, soundfile>/python film/music.py   -> film/out/music/<mood>.wav (about 30 s each)
import os, sys
import torch, soundfile as sf
from transformers import AutoProcessor, MusicgenForConditionalGeneration

MOODS = {
    "calm": "slow ambient space drone, deep warm analog synth pads, distant soft piano notes, vast and calm, mysterious, no drums, 60 bpm",
    "rise": "hopeful cinematic ambient score, warm evolving synth pads, gentle felt piano arpeggio, soft heartbeat pulse, wonder and discovery, 76 bpm",
    "swell": "emotional cinematic finale, soaring warm strings and pads, piano melody, hopeful resolution, spacious reverb, 76 bpm",
}
out = os.path.join(os.path.dirname(__file__), "out", "music")
os.makedirs(out, exist_ok=True)
dev = "cuda" if torch.cuda.is_available() else "cpu"
proc = AutoProcessor.from_pretrained("facebook/musicgen-medium")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-medium", torch_dtype=torch.float16 if dev == "cuda" else torch.float32).to(dev)
rate = model.config.audio_encoder.sampling_rate
for name in sys.argv[1:] or MOODS:
    torch.manual_seed(7)  # same take every run
    inputs = proc(text=[MOODS[name]], padding=True, return_tensors="pt").to(dev)
    with torch.no_grad():
        wav = model.generate(**inputs, do_sample=True, guidance_scale=3.5, max_new_tokens=1500)
    sf.write(os.path.join(out, f"{name}.wav"), wav[0, 0].float().cpu().numpy(), rate)
    print(name, wav.shape[-1] / rate, "s")
