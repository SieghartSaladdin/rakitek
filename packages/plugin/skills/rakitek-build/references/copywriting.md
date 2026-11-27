# Rakitek Copywriting Reference (Anti-Slop)

Read this file before writing or auditing copy for Rakitek section props (headlines, subheadlines, descriptions, cards, stats, testimonials, FAQs, nav labels, CTAs, and footer text).

Two rules govern every rewrite:
- **Never invent facts.** Add no fact, name, number, date, quote, award, or citation that is not in the user's brief or source material. If a line needs real detail to work, ask for it, drop the optional slot, or use an honest placeholder (`[REAL DATA]`, `[CUSTOMER NAME]`).
- **Do not over-sterilize.** Scrubbing AI patterns is half the job; bland, voiceless copy still reads machine-made. When the user supplies a brand voice, tagline, or writing sample, keep it.

## Honesty & Evidence

- **Fabricated specifics:** Never invent realistic-looking metrics, quotes, names, or certifications ("Trusted by 10,000+ teams", "99.9% uptime", "SOC 2", fictional reviewers).
  - *Before:* `Trusted by 10,000+ teams. "Cut our review time in half." - Sarah Chen, VP Engineering`
  - *After:* Drop the slot if no real proof exists, hide the sub-part via props, or mark `[REAL TESTIMONIAL]` when the user explicitly asked for a placeholder.
- **Empty claims & unverified social proof:** Cut "industry-leading", "world-class", "loved by customers everywhere" unless backed by a named, real source from the brief.
- **Weasel attributions:** Cut "Experts say", "industry observers", "leading analysts believe". Name a real source from the brief or delete the line.
- **Speculative gap-filling:** Never invent plausible filler when a detail is missing ("the founder likely started small and grew through word of mouth"). Omit missing history.
- **Generic FAQs:** Never fill an FAQ section with boilerplate ("Is my data secure?", "Can I cancel anytime?") that does not reflect real customer questions from the brief. Drop the FAQ slot instead.
- **Generic positive conclusions:** Cut empty send-offs ("The future looks bright", "Exciting times lie ahead"). End on the last concrete fact or real next step.
- **Knowledge-cutoff / chat leftovers:** Never leave model disclaimers ("As of my last update"), chatbot openers ("Great question!", "Certainly!"), or chatbot closers ("I hope this helps!", "Let me know if you have questions") in page copy.

## Tone, Vocabulary & CTAs

- **Empty AI vocabulary:** Replace *unlock, elevate, empower, delve, showcase, testament, landscape (abstract), journey, robust, game-changer, next-level, seamless, cutting-edge, revolutionary, AI-powered, effortless, ultimate* with what the business or product actually does.
  - *Before:* `Unlock seamless collaboration to elevate your team's journey.`
  - *After:* `Work with your team in one shared space.`
- **Significance inflation:** Cut "the future of X", "marking a pivotal moment", "ushering in a new era". State the concrete benefit instead.
- **Generic CTAs:** Replace *Get Started, Learn More, Try Now, Explore, Discover* with the real action tied to the brief (*Book a table, Request a quote, See the menu, Start 14-day trial, Download the spec*).
- **Actorless passive:** Name who acts when the actor is known ("We updated our menu for spring" instead of "The menu has been updated"). Passive is fine when the actor is irrelevant or unknown ("Orders ship within 24 hours").
- **Inanimate subject, human verb:** Do not give software or objects human minds (*understands, knows, decides, wants, believes, cares*). Ordinary product verbs ("shows", "filters", "submits") are fine.
  - *Before:* `The dashboard understands what your team needs.`
  - *After:* `The dashboard opens on the three metrics your team checks every morning.`
- **Copula avoidance:** Use plain "is" and "has" instead of "serves as", "stands as", "functions as", or "boasts".
- **Nominalized verbs:** Use one direct verb instead of a weak verb plus a noun ("review your setup" instead of "conduct an analysis of your setup").
- **Vague quantifiers:** Replace "countless", "a myriad of", "a plethora of", "a wide range of" with real items from the brief or plain scope ("connects to Slack, GitHub, and Google Drive").
- **Persuasive authority tropes:** Cut "at its core", "what really matters", "fundamentally", "the heart of the matter". State the point directly.
- **Fake-candid openers & signposting:** Cut "Honestly?", "Let's be honest", "Here's the thing", "Real talk", "Let's dive in", "Here's what you need to know", "Without further ado".
- **Temporal runway clichés:** Cut "In today's fast-paced world", "In an era of rapid disruption", "In today's ever-evolving digital landscape". Start with the real subject.
- **Scene-setting hypotheticals & faux-intimate address:** Cut "Picture this:", "Imagine a world where", "You might be wondering", "We've all been there", "Sound familiar?". Use a real example from the brief or state what the product does.
- **Audience sweep:** Cut "Whether you're a startup or an enterprise" / "Whether you're a seasoned pro or just getting started". Name the real audience from the brief or omit the clause.
- **Straw-man setup:** Cut "Most people think X. The truth is Y." unless correcting a real, documented misconception from the brief.

## Rhythm & Structure

- **Rule of Three overuse:** Do not force every list, card grid, or sentence into threes. Use the number of items the brief actually has.
- **Negative parallelism & tailing negations:** Avoid "It's not just X, it's Y", "Not only X, but also Y", and clipped tag-ons ("no guessing", "no wasted motion").
- **Aphorism formulas:** Avoid "X is the language of Y", "X is not a tool but a mirror", "Efficiency becomes a trap when...". State the plain claim.
- **Staccato drama:** One short sentence for emphasis is fine; cut runs of clipped fragments ("No templates. No defaults. No safety.").
- **Theatrical takeaways:** Cut "Read that again.", "Let that sink in.", "The takeaway is simple:", "Here is the bottom line:".
- **Teaser reveals & deferred subjects:** Cut "The result?", "The kicker:", "Plot twist:", "There's one thing slowing your team down: manual QA." Put the subject first ("Manual QA slows your team down.").
- **Self-answered questions:** Cut rhetorical Q&A pairs ("Why does this matter? Because..."). Real FAQs from the brief stay.
- **Participial praise tack-ons:** Cut trailing "-ing" verdicts ("..., ensuring peace of mind", "..., making it ideal for teams of any size", "..., highlighting our commitment to quality"). Factual participles ("runs nightly, starting at 02:00") are fine.
- **Anaphora stacks & escalation tails:** Combine repetitive sentence starters ("It's faster. It's cheaper. It's simpler.") and cut infomercial bridges ("But that's not all.", "And it gets better.").
- **Mic-drop closers & summary echoes:** Do not end every section with a quotable punchline ("Because simplicity wins.") or a recap ("All in all, this makes work faster and safer.").
- **False ranges & synonym cycling:** Cut "from first click to final invoice, and everything in between" (name real steps) and repeat the clearest word instead of cycling awkward synonyms ("fast... quick... speedy").
- **Reflexive concession:** Cut empty balance clauses ("While every team is different...") unless naming a real condition from the brief.

## Punctuation, Headings & Formatting Hygiene

- **No em dashes:** Do not output em dashes (`—`, spaced ` — `, or `--` as an aside) in generated copy. Use a period, comma, colon, or parentheses instead. If the user's own writing sample deliberately uses em dashes, ask before keeping or removing them.
- **Direct headings:** Label the content directly. Avoid colon-reveal metaphors ("The Silent Killer: Why Builds Are Slow") and essay-template section titles ("Overview", "Key Takeaways", "Final Thoughts").
- **Sentence case in lists:** Use natural sentence case for feature bullets and list entries (unless the section's CSS transforms case); keep proper nouns and acronyms capitalized.
- **Clean emphasis & punctuation:**
  - Skip decorative emojis in headings and bullets (`🚀`, `💡`, `✅`).
  - Avoid inline-header bullets (`- **Performance:** Load times are faster`) when plain prose reads better.
  - Avoid all-caps emphasis clauses inside paragraphs, exclamation stacking on neutral lines, mechanical bolding of every key term, and scare quotes around ordinary words.
  - Cut filler phrases ("in order to" -> "to", "due to the fact that" -> "because", "at this point in time" -> "now", "it is important to note that" -> omit) and stacked hedging ("could potentially possibly" -> "may").
  - Write connected arguments as prose rather than chopping cause-and-effect into disconnected bullets.

## What NOT to Flag & Signs of Human Writing

Look for **clusters of tells**, not isolated traits. Do not gut legitimate prose for:
- Clean grammar, precise formal words, a single transition word, one short emphatic sentence, or quoted secondhand text/proper names.

Preserve these signs of real human writing when present in the user's brief or writing sample:
- Specific, hard-to-fabricate details (real street addresses, local terms, exact hours, unusual anecdotes).
- Honest nuance or trade-offs instead of smooth PR phrasing.
- Natural variety in sentence length and genuine brand quirks.

### Voice Calibration
If the user supplies a writing sample or brand guide, read it first and match its sentence lengths, register, and vocabulary instead of flattening it to a neutral default. Ask before altering any deliberate style habit (such as em dashes) in their own sample.

## Draft, Audit, Final

Run this quick loop on all rendered prop copy before finishing:
1. **Draft:** Fill every section's props using facts from the brief, direct verbs, specific CTAs, and natural sentence rhythm.
2. **Audit:** Answer two checks:
   - *What in this copy still reads as obviously AI-generated?*
   - *Does any headline, stat, quote, name, or claim state a fact not in the brief?*
3. **Final:** Fix both findings and scan one last time for em dashes.

## Quick Copy Checklist

- [ ] Every fact, number, name, date, quote, and claim comes from the brief or is an explicit placeholder
- [ ] Optional `stats`, `proof`, testimonial, or FAQ slots with no real data were dropped or hidden
- [ ] AI buzzwords and empty inflation replaced with concrete product/service language
- [ ] Every CTA names a specific action for this business
- [ ] Zero em dashes (`—` or ` -- `) in generated copy
- [ ] No AI openings, cadence formulas, participial praise tack-ons, mic-drop closers, or summary echoes
- [ ] Direct headings (no colon-reveal metaphors or essay-template titles) and sentence-case list items
- [ ] Copy keeps the brand's voice and reads naturally aloud
