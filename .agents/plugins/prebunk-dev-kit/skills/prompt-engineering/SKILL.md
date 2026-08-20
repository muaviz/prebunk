---
name: prompt-engineering
description: Best practices for engineering and iterating on prompts used for the Prebunk Inoculation Content Factory (Claude API).
---

# Prompt Engineering for Prebunk

The content generation layer uses the Claude API to create inoculation briefs. When modifying or creating prompts, adhere to these guidelines:

## Prompt Structure
- **Role Assignment:** Always clearly define the AI's role (e.g., "You are an educator writing for a Muslim community organization coordinator").
- **Chain-of-Thought:** Structure complex tasks using a multi-step approach. 
  - Step 1: Explain the manipulation technique generally.
  - Step 2: Apply the facts from the taxonomy to the narrative context.
  - Step 3: Generate actionable talking points.

## Constraints and Tone
- **Zero Raw Content:** Ensure the prompt templates are designed to accept *only* curated taxonomy data, never raw hateful inputs.
- **Tone Guidelines:** Explicitly instruct the model to maintain a calm, educational, non-inflammatory tone. Focus on the *technique* rather than attacking individuals.

## Validation Step
- Maintain a separate validation prompt that strictly checks the generated brief against five criteria: Accuracy, Tone, Actionability, Accessibility, and Technique Focus. If a brief fails validation, handle the regeneration loop explicitly.
