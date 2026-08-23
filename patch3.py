with open("apps/web/src/app/taxonomy/[id]/page.tsx", "r") as f:
    content = f.read()

import_statement = 'import { notFound } from "next/navigation";\nimport { SiteHeader }'
content = content.replace('import { SiteHeader }', import_statement)

fetch_replacement = """
  let narrative: Narrative | null = null;
  try {
    narrative = await fetchApi<Narrative>(`/narratives/${resolvedParams.id}`);
  } catch (error) {
    notFound();
  }
  
  if (!narrative) {
    notFound();
  }
"""
content = content.replace(
    'const narrative = await fetchApi<Narrative>(`/narratives/${resolvedParams.id}`);',
    fetch_replacement
)

with open("apps/web/src/app/taxonomy/[id]/page.tsx", "w") as f:
    f.write(content)
