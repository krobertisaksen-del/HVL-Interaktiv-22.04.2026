import re

with open('constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r"Ting å se på igjen": "Ting å sjå på igjen",
    r"Ikke helt\.\.\.": "Ikkje heilt...",
    r"Alt riktig!": "Alt rett!",
    r"Du må ha alt riktig for å fullføre\.": "Du må ha alt rett for å fullføre.",
    r"Du må ha alt riktig for å fullføre aktiviteten\.": "Du må ha alt rett for å fullføre aktiviteten.",
    r"Fortsett": "Hald fram",
    r"Fantastisk! Alt er riktig plassert\.": "Fantastisk! Alt er rett plassert.",
    r"Alle elementer er plassert": "Alle element er plasserte",
    r"Neste Oppgave": "Neste oppgåve",
    r"Alle par funnet!": "Alle par funne!",
    r"Neste Video": "Neste video",
    r"Du har fullført alle deloppgavene\.": "Du har fullført alle deloppgåvene.",
    r"Flere saman": "Fleire saman",
}

for k, v in replacements.items():
    content = re.sub(k, v, content)

with open('constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
